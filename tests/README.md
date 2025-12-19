# GraphMemory 测试文档

## 测试概述

本项目包含完整的测试套件，覆盖单元测试、集成测试和性能测试。

## 测试结构

```
tests/
├── __init__.py
├── conftest.py              # Pytest 配置和共享 fixtures
├── unit/                    # 单元测试
│   ├── test_buffer.py       # 缓冲区测试
│   └── test_graph_store.py  # 图数据库测试
├── integration/             # 集成测试
│   └── test_webui_api.py    # WebUI API 测试
└── fixtures/                # 测试数据
```

## 运行测试

### 运行所有测试

```bash
pytest
```

### 运行特定类型的测试

```bash
# 只运行单元测试
pytest -m unit

# 只运行集成测试
pytest -m integration

# 只运行 WebUI 测试
pytest -m webui
```

### 运行特定文件

```bash
pytest tests/unit/test_buffer.py
pytest tests/integration/test_webui_api.py
```

### 运行特定测试函数

```bash
pytest tests/unit/test_buffer.py::test_buffer_initialization
```

### 显示详细输出

```bash
pytest -v
pytest -vv  # 更详细
```

### 显示打印输出

```bash
pytest -s
```

### 生成覆盖率报告

```bash
# 安装 pytest-cov
pip install pytest-cov

# 运行测试并生成覆盖率报告
pytest --cov=. --cov-report=html

# 查看报告
open htmlcov/index.html
```

## 测试标记

项目使用以下测试标记:

- `@pytest.mark.unit`: 单元测试
- `@pytest.mark.integration`: 集成测试
- `@pytest.mark.slow`: 慢速测试
- `@pytest.mark.webui`: WebUI 相关测试
- `@pytest.mark.requires_llm`: 需要 LLM 的测试
- `@pytest.mark.requires_embedding`: 需要 Embedding 的测试

### 跳过特定标记的测试

```bash
# 跳过慢速测试
pytest -m "not slow"

# 跳过需要 LLM 的测试
pytest -m "not requires_llm"
```

## 测试覆盖范围

### 单元测试

#### 缓冲区模块 (test_buffer.py)

- ✅ 缓冲区初始化
- ✅ 添加消息
- ✅ 获取消息（带限制）
- ✅ 清空消息
- ✅ 多会话隔离

#### 图数据库模块 (test_graph_store.py)

- ✅ 图数据库初始化
- ✅ 创建实体
- ✅ 更新实体
- ✅ 删除实体
- ✅ 创建关系
- ✅ 搜索实体
- ✅ 获取统计信息

### 集成测试

#### WebUI API (test_webui_api.py)

- ✅ 获取系统状态
- ✅ 获取实体列表
- ✅ 搜索实体
- ✅ 获取关系列表
- ✅ 获取统计概览
- ✅ 导出图谱
- ✅ 导入图谱
- ✅ 未授权访问
- ✅ 缺少密钥

## 前端测试

前端测试使用 Vitest 和 Vue Test Utils。

### 运行前端测试

```bash
cd webui-src
npm run test
```

### 前端测试覆盖

- 组件渲染测试
- 用户交互测试
- API 调用测试
- 路由测试

## 性能测试

### 图数据库性能

测试大规模数据下的性能:

```bash
pytest tests/performance/test_graph_performance.py
```

### WebUI API 性能

测试 API 响应时间:

```bash
pytest tests/performance/test_api_performance.py
```

## 测试数据

### Fixtures

测试使用以下共享 fixtures:

- `temp_dir`: 临时目录
- `mock_config`: 模拟配置
- `sample_entities`: 示例实体数据
- `sample_relations`: 示例关系数据
- `mock_graph_store`: 模拟图数据库
- `mock_buffer`: 模拟缓冲区

### 测试数据库

测试使用临时数据库，测试结束后自动清理。

## CI/CD 集成

GitHub Actions 自动运行测试:

```yaml
- name: Run tests
  run: |
    pip install pytest pytest-asyncio pytest-cov
    pytest --cov=. --cov-report=xml
```

## 编写新测试

### 单元测试模板

```python
import pytest

@pytest.mark.unit
@pytest.mark.asyncio
async def test_example(mock_graph_store):
    """测试描述"""
    # Arrange
    # 准备测试数据

    # Act
    # 执行测试操作

    # Assert
    # 验证结果
    assert True
```

### 集成测试模板

```python
import pytest

@pytest.mark.integration
@pytest.mark.webui
def test_api_example(test_client):
    """测试描述"""
    response = test_client.get("/api/endpoint?key=test_key")
    assert response.status_code == 200
    assert response.json()["success"] is True
```

## 测试最佳实践

1. **独立性**: 每个测试应该独立运行，不依赖其他测试
2. **清理**: 使用 fixtures 自动清理测试数据
3. **命名**: 使用描述性的测试函数名
4. **文档**: 为每个测试添加 docstring
5. **断言**: 使用明确的断言消息
6. **标记**: 正确标记测试类型

## 故障排除

### 测试失败

1. 检查测试输出的错误信息
2. 使用 `-vv` 查看详细输出
3. 使用 `-s` 查看打印输出
4. 检查测试数据是否正确

### 数据库锁定

如果遇到数据库锁定问题:

```bash
# 清理测试数据库
rm -rf /tmp/pytest-*
```

### 依赖问题

确保安装了所有测试依赖:

```bash
pip install pytest pytest-asyncio pytest-cov fastapi httpx
```

## 测试覆盖率目标

- **单元测试**: 目标 80% 以上
- **集成测试**: 覆盖所有 API 端点
- **关键路径**: 100% 覆盖

## 持续改进

- 定期审查测试覆盖率
- 添加新功能时同步添加测试
- 修复 Bug 时添加回归测试
- 优化慢速测试

---

**最后更新**: 2025-12-19
