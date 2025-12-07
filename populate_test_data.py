# data/plugins/astrbot_plugin_GraphMemory/populate_test_data.py

r"""
一个用于向 GraphMemory 数据库填充测试数据的独立脚本。
该脚本旨在创建一个包含多个会话、用户、实体和关系的复杂图谱，
以便于对 WebUI 的功能进行全面测试。

如何运行:
1. 确保你的终端位于 AstrBot 项目的根目录 (即 `D:\LIIXIANG\documents\code\Bot\AstrBot`)。
2. 运行以下命令:
   python -m data.plugins.astrbot_plugin_GraphMemory.populate_test_data
"""

import asyncio
import platform
import sys
import time
from pathlib import Path

# 在 Windows 上设置事件循环策略，避免 ProactorEventLoop 问题
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# 将项目根目录添加到 Python 路径中，以便能够导入 astrbot 模块
# 这是必要的，因为我们想直接使用插件的 GraphEngine 和实体定义
ROOT_DIR = Path(__file__).resolve().parents[3]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

# 在导入插件模块之前，需要确保 astrbot 核心模块可以被找到
try:
    from data.plugins.astrbot_plugin_GraphMemory.core.graph_engine import GraphEngine
    from data.plugins.astrbot_plugin_GraphMemory.core.graph_entities import (
        EntityNode,
        MentionsRel,
        MessageNode,
        RelatedToRel,
        SessionNode,
        UserNode,
    )
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保您是从 AstrBot 项目的根目录运行此脚本。")
    sys.exit(1)


# --- 定义测试数据 ---

USERS = [
    UserNode(id="qq_1001", name="Alice", platform="qq"),
    UserNode(id="qq_1002", name="Bob", platform="qq"),
    UserNode(id="qq_1003", name="Carol", platform="qq"),
    UserNode(id="discord_2001", name="Charlie", platform="discord"),
    UserNode(id="discord_2002", name="Dave", platform="discord"),
]

SESSIONS = [
    SessionNode(id="qq_group_A", type="GROUP", name="技术交流群"),
    SessionNode(id="qq_group_B", type="GROUP", name="Python学习小组"),
    SessionNode(id="discord_channel_B", type="GROUP", name="游戏开黑频道"),
    SessionNode(id="qq_private_1001", type="PRIVATE", name="与 Alice 的私聊"),
]

ENTITIES = [
    EntityNode(name="Python", type="Programming_Language", summary="一种流行的高级编程语言，以其简洁的语法和强大的生态系统而闻名。"),
    EntityNode(name="AstrBot", type="Software_Framework", summary="一个可扩展的聊天机器人框架，支持多平台和插件系统。"),
    EntityNode(name="GraphRAG", type="Technology", summary="一种结合图数据库和检索增强生成（RAG）的技术，用于增强AI的知识检索能力。"),
    EntityNode(name="KuzuDB", type="Database", summary="一个嵌入式图数据库，专为高性能图查询而设计。"),
    EntityNode(name="Elden Ring", type="Video_Game", summary="一款由FromSoftware开发的开放世界动作角色扮演游戏。"),
    EntityNode(name="FastAPI", type="Software_Framework", summary="一个现代、快速的Python Web框架，用于构建API。"),
    EntityNode(name="机器学习", type="Concept", summary="人工智能的一个分支，使计算机能够从数据中学习并做出预测。"),
]

RELATIONS = [
    RelatedToRel(src_entity="AstrBot", tgt_entity="Python", relation="written_in"),
    RelatedToRel(src_entity="AstrBot", tgt_entity="FastAPI", relation="uses"),
    RelatedToRel(src_entity="AstrBot", tgt_entity="GraphRAG", relation="implements"),
    RelatedToRel(src_entity="GraphRAG", tgt_entity="KuzuDB", relation="uses_database"),
    RelatedToRel(src_entity="Python", tgt_entity="机器学习", relation="used_for"),
    RelatedToRel(src_entity="FastAPI", tgt_entity="Python", relation="written_in"),
]

DIALOGUES = [
    # 会话 1: 技术交流群 - 讨论 AstrBot
    {"session": "qq_group_A", "user": "qq_1001", "content": "有人在用 Python 写机器人吗？", "timestamp_offset": 0},
    {"session": "qq_group_A", "user": "qq_1002", "content": "我正在用，基于 AstrBot 框架，感觉还不错。", "timestamp_offset": 120},
    {"session": "qq_group_A", "user": "qq_1001", "content": "AstrBot 听起来很酷，它支持 GraphRAG 吗？", "timestamp_offset": 240},
    {"session": "qq_group_A", "user": "qq_1002", "content": "支持的，它内置了一个基于 KuzuDB 的 GraphRAG 插件。", "timestamp_offset": 300},
    {"session": "qq_group_A", "user": "qq_1003", "content": "我也在研究，AstrBot 用 FastAPI 做的后端接口很方便。", "timestamp_offset": 480},

    # 会话 2: Python学习小组
    {"session": "qq_group_B", "user": "qq_1001", "content": "Python 真的很适合机器学习领域", "timestamp_offset": 600},
    {"session": "qq_group_B", "user": "qq_1003", "content": "是的，生态系统非常完善，库也很丰富", "timestamp_offset": 720},

    # 会话 3: 游戏开黑频道
    {"session": "discord_channel_B", "user": "discord_2001", "content": "晚上有人一起玩 Elden Ring 吗？", "timestamp_offset": 900},
    {"session": "discord_channel_B", "user": "discord_2001", "content": "我刚打到雪山，有点难。", "timestamp_offset": 1020},
    {"session": "discord_channel_B", "user": "discord_2002", "content": "我可以帮你，那个BOSS确实挺难的", "timestamp_offset": 1140},

    # 会话 4: 与 Alice 的私聊
    {"session": "qq_private_1001", "user": "qq_1001", "content": "你对 GraphRAG 了解多少？", "timestamp_offset": 1260},
]


async def populate_data():
    """主函数，用于执行数据填充。"""
    print("--- 开始填充 GraphMemory 测试数据 ---")

    # 使用正确的 plugin_data 路径
    plugin_data_path = ROOT_DIR / "data" / "plugin_data" / "astrbot_plugin_GraphMemory"
    plugin_data_path.mkdir(parents=True, exist_ok=True)

    # 使用 None 作为 embedding_provider，因为我们不需要在此脚本中生成向量
    engine = GraphEngine(plugin_data_path, embedding_provider=None)

    print(f"数据库路径: {engine.db_path}")

    # 1. 插入基础节点 (Users, Sessions, Entities)
    print("\n[1/5] 正在插入用户、会话和实体节点...")
    user_tasks = [engine.add_user(u) for u in USERS]
    session_tasks = [engine.add_session(s) for s in SESSIONS]
    entity_tasks = [engine.add_entity(e) for e in ENTITIES]
    await asyncio.gather(*user_tasks, *session_tasks, *entity_tasks)
    print(f"  - 插入了 {len(USERS)} 个用户, {len(SESSIONS)} 个会话, {len(ENTITIES)} 个实体。")

    # 2. 插入实体间的关系
    print("\n[2/5] 正在插入实体间的关系...")
    relation_tasks = [engine.add_relation(r) for r in RELATIONS]
    await asyncio.gather(*relation_tasks)
    print(f"  - 插入了 {len(RELATIONS)} 条实体关系。")

    # 3. 模拟对话，插入消息和提及关系
    print("\n[3/5] 正在模拟对话并插入消息...")
    base_timestamp = int(time.time()) - 86400  # 从24小时前开始
    msg_id_counter = base_timestamp

    for entry in DIALOGUES:
        msg_id = str(msg_id_counter)
        # 使用相对时间偏移，使对话看起来更自然
        timestamp = base_timestamp + entry.get("timestamp_offset", 0)

        message = MessageNode(
            id=msg_id,
            content=entry["content"],
            timestamp=timestamp,
            sender_id=entry["user"],
            session_id=entry["session"],
        )
        await engine.add_message(message)

        # 基于关键词创建 MENTIONS 关系
        mentions_created = 0
        for entity in ENTITIES:
            if entity.name.lower() in entry["content"].lower():
                mention = MentionsRel(
                    message_id=msg_id,
                    entity_name=entity.name,
                    sentiment="Positive"  # 可以根据内容设置不同的情感
                )
                await engine.add_mention(mention)
                mentions_created += 1

        msg_id_counter += 1

    print(f"  - 插入了 {len(DIALOGUES)} 条消息，包含多个实体提及关系。")

    # 4. 为会话创建记忆摘要
    print("\n[4/6] 正在创建记忆摘要...")

    # 为技术交流群创建摘要
    summary_text_1 = "Alice、Bob 和 Carol 讨论了使用 Python 和 AstrBot 框架开发聊天机器人。他们提到 AstrBot 支持 GraphRAG 技术，并使用 KuzuDB 作为图数据库，FastAPI 用于构建后端接口。"
    await engine.consolidate_memory(
        session_id="qq_group_A",
        summary_text=summary_text_1,
        message_ids=[],  # 在此脚本中我们不关心归档，所以传空列表
        user_ids=["qq_1001", "qq_1002", "qq_1003"],
    )
    print("  - 为 '技术交流群' 创建了记忆摘要。")

    # 为Python学习小组创建摘要
    summary_text_2 = "Alice 和 Carol 讨论了 Python 在机器学习领域的应用，认为其生态系统完善且库资源丰富。"
    await engine.consolidate_memory(
        session_id="qq_group_B",
        summary_text=summary_text_2,
        message_ids=[],
        user_ids=["qq_1001", "qq_1003"],
    )
    print("  - 为 'Python学习小组' 创建了记忆摘要。")

    # 5. 手动创建一些额外的测试节点
    print("\n[5/6] 正在创建额外的测试节点...")

    # 创建一个孤立的实体，用于测试"删除孤立实体"功能
    await engine.add_node_manually("Entity", {
        "name": "孤立的测试节点",
        "type": "Test",
        "summary": "这是一个用于测试的孤立实体节点，没有任何关系连接。"
    })
    print("  - 创建了 '孤立的测试节点' (用于测试删除孤立实体功能)。")

    # 创建额外的实体，这些实体将通过消息的 MENTIONS 关系与图谱关联
    additional_entities = [
        EntityNode(name="Docker", type="Technology", summary="容器化技术平台"),
        EntityNode(name="Kubernetes", type="Technology", summary="容器编排平台"),
    ]
    for entity in additional_entities:
        await engine.add_entity(entity)
    print(f"  - 创建了 {len(additional_entities)} 个额外的实体节点。")

    # 6. 显示最终统计
    print("\n[6/6] 正在生成数据统计...")
    stats = await engine.get_graph_statistics()
    if stats:
        print("  数据库统计:")
        for key, value in stats.items():
            print(f"    - {key}: {value}")

    engine.close()
    print("\n--- 数据填充完成！ ---")


if __name__ == "__main__":
    # 检查数据库是否已存在，避免重复填充
    db_folder = ROOT_DIR / "data" / "plugins" / "astrbot_plugin_GraphMemory" / "kuzu_db_v2"
    if db_folder.exists():
        print(f"警告: 数据库文件夹 '{db_folder}' 已存在。")
        choice = input("您想删除现有数据库并重新填充吗？ (y/N): ").lower()
        if choice == "y":
            import shutil
            print(f"正在删除旧数据库: {db_folder}")
            shutil.rmtree(db_folder)
        else:
            print("操作已取消。")
            sys.exit(0)

    asyncio.run(populate_data())
