#!/bin/bash
# 测试运行脚本

set -e

echo "=========================================="
echo "GraphMemory 测试套件"
echo "=========================================="
echo ""

# 检查 pytest
if ! command -v pytest &> /dev/null; then
    echo "错误: 未安装 pytest"
    echo "请运行: pip install pytest pytest-asyncio pytest-cov"
    exit 1
fi

echo "pytest 版本: $(pytest --version)"
echo ""

# 进入项目目录
cd "$(dirname "$0")/.."

# 选择测试类型
if [ "$1" == "unit" ]; then
    echo "=========================================="
    echo "运行单元测试..."
    echo "=========================================="
    pytest -m unit -v

elif [ "$1" == "integration" ]; then
    echo "=========================================="
    echo "运行集成测试..."
    echo "=========================================="
    pytest -m integration -v

elif [ "$1" == "webui" ]; then
    echo "=========================================="
    echo "运行 WebUI 测试..."
    echo "=========================================="
    pytest -m webui -v

elif [ "$1" == "coverage" ]; then
    echo "=========================================="
    echo "运行测试并生成覆盖率报告..."
    echo "=========================================="
    pytest --cov=. --cov-report=html --cov-report=term
    echo ""
    echo "覆盖率报告已生成: htmlcov/index.html"

else
    echo "=========================================="
    echo "运行所有测试..."
    echo "=========================================="
    pytest -v
fi

echo ""
echo "=========================================="
echo "测试完成！"
echo "=========================================="
