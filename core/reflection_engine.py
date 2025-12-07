# data/plugins/astrbot_plugin_GraphMemory/core/reflection_engine.py

"""
该模块定义了 `ReflectionEngine`，负责实现 Agentic 反思机制。
它允许 Bot 主动回顾、分析和优化其内部知识图谱，实现从被动记录到主动学习的跨越。
"""

import asyncio
import json
from typing import TYPE_CHECKING

from astrbot.api import logger

from .extractor import KnowledgeExtractor
from .graph_entities import RelatedToRel
from .prompts import FACT_CORRECTION_PROMPT, RELATION_INFERENCE_PROMPT

if TYPE_CHECKING:
    from .graph_engine import GraphEngine
    from .plugin_service import PluginService


class ReflectionEngine:
    """
    Agentic 反思引擎。
    在后台运行，定期触发对知识图谱的分析、修正和推断。
    """

    def __init__(self, service: "PluginService"):
        """
        初始化 ReflectionEngine。

        Args:
            service (PluginService): PluginService 的实例，用于访问其他组件。
        """
        self.service = service
        self.context = service.context
        self.graph_engine: GraphEngine = service.graph_engine
        self.extractor: KnowledgeExtractor = service.extractor
        self._task: asyncio.Task | None = None

    async def start(self, interval: int):
        """启动后台反思循环。"""
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._reflection_loop(interval))
            logger.info(f"[GraphMemory] Agentic 反思引擎已启动，检查间隔: {interval}秒。")

    async def stop(self):
        """停止后台反思循环。"""
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            logger.info("[GraphMemory] Agentic 反思引擎已停止。")

    async def _reflection_loop(self, interval: int):
        """反思循环的主体。"""
        # 启动时延迟一段时间，避免和启动任务冲突
        await asyncio.sleep(300)
        while True:
            logger.info("[GraphMemory] 开始执行一轮 Agentic 反思...")
            try:
                await self.run_reflection_cycle()
            except Exception as e:
                logger.error(f"[GraphMemory] Agentic 反思循环出错: {e}", exc_info=True)

            await asyncio.sleep(interval)

    async def run_reflection_cycle(self):
        """
        执行一轮完整的反思周期：事实修正 -> 关系推断。
        """
        if not self.service.learning_model_id:
            logger.debug("[GraphMemory] 未配置 learning_model_id，跳过反思周期。")
            return

        # 1. 获取用于反思的候选节点
        candidates = await self.graph_engine.get_reflection_candidates(limit=5)
        if not candidates:
            logger.info("[GraphMemory] 未找到用于反思的候选节点。")
            return

        logger.info(f"[GraphMemory] 找到 {len(candidates)} 个候选节点进行反思。")

        for candidate in candidates:
            node_id = candidate["id"]
            node_type = candidate["type"]

            # 2. 为节点构建上下文包
            context_package = await self.graph_engine.get_node_context_package(node_id, node_type)
            if not context_package or "是孤立的" in context_package:
                logger.debug(f"跳过对孤立节点 {node_type}:{node_id} 的反思。")
                continue

            # 3. 运行事实修正
            await self._run_fact_correction(node_id, node_type, context_package)

            # 4. 运行关系推断
            await self._run_relation_inference(node_id, node_type, context_package)

    async def _run_fact_correction(self, node_id: str, node_type: str, context_package: str):
        """使用 LLM 检查事实不一致性并进行修正。"""
        prompt = FACT_CORRECTION_PROMPT.format(context_package=context_package)
        llm_resp = await self._call_llm(prompt)
        if not llm_resp:
            return

        try:
            corrections = json.loads(llm_resp)
            if not corrections.get("has_errors"):
                logger.debug(f"节点 {node_id} 未发现事实错误。")
                return

            for correction in corrections.get("corrections", []):
                target_node_id = correction.get("node_id")
                target_node_type = correction.get("node_type")
                updates = correction.get("updated_properties")

                if not all([target_node_id, target_node_type, updates]):
                    continue

                logger.info(f"[Reflection] 正在修正节点 {target_node_type}:{target_node_id}，更新: {updates}")
                await self.graph_engine.update_node_properties(target_node_id, target_node_type, updates)

        except (json.JSONDecodeError, TypeError) as e:
            logger.error(f"解析事实修正的 LLM 响应失败: {e}\n响应: {llm_resp}")

    async def _run_relation_inference(self, node_id: str, node_type: str, context_package: str):
        """使用 LLM 推断节点之间的新关系。"""
        prompt = RELATION_INFERENCE_PROMPT.format(context_package=context_package)
        llm_resp = await self._call_llm(prompt)
        if not llm_resp:
            return

        try:
            inferences = json.loads(llm_resp)
            new_relations = inferences.get("new_relations", [])
            if not new_relations:
                logger.debug(f"未从节点 {node_id} 的上下文中推断出新关系。")
                return

            for rel_data in new_relations:
                src = rel_data.get("source_entity")
                tgt = rel_data.get("target_entity")
                rel = rel_data.get("relation_description")

                if not all([src, tgt, rel]):
                    continue

                logger.info(f"[Reflection] 正在添加推断出的关系: ({src})-[{rel}]->({tgt})")
                new_rel = RelatedToRel(src_entity=src, tgt_entity=tgt, relation=rel)
                await self.graph_engine.add_relation(new_rel)

        except (json.JSONDecodeError, TypeError) as e:
            logger.error(f"解析关系推断的 LLM 响应失败: {e}\n响应: {llm_resp}")

    async def _call_llm(self, prompt: str) -> str | None:
        """调用 LLM 并返回文本响应的辅助函数。"""
        if not self.service.learning_model_id:
            logger.warning("[GraphMemory] 尝试调用 LLM 进行反思，但未配置 learning_model_id。")
            return None
        try:
            # 修正: 使用正确的 context.llm_generate 方法
            resp = await self.context.llm_generate(
                chat_provider_id=self.service.learning_model_id,
                prompt=prompt
            )
            return resp.completion_text
        except Exception as e:
            logger.error(f"调用 LLM 进行反思时出错: {e}", exc_info=True)
            return None
