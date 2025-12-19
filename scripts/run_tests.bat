@echo off
REM 测试运行脚本 (Windows)

echo ==========================================
echo GraphMemory 测试套件
echo ==========================================
echo.

REM 检查 pytest
where pytest >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未安装 pytest
    echo 请运行: pip install pytest pytest-asyncio pytest-cov
    exit /b 1
)

echo pytest 版本:
pytest --version
echo.

REM 进入项目目录
cd /d "%~dp0.."

REM 选择测试类型
if "%1"=="unit" (
    echo ==========================================
    echo 运行单元测试...
    echo ==========================================
    pytest -m unit -v
) else if "%1"=="integration" (
    echo ==========================================
    echo 运行集成测试...
    echo ==========================================
    pytest -m integration -v
) else if "%1"=="webui" (
    echo ==========================================
    echo 运行 WebUI 测试...
    echo ==========================================
    pytest -m webui -v
) else if "%1"=="coverage" (
    echo ==========================================
    echo 运行测试并生成覆盖率报告...
    echo ==========================================
    pytest --cov=. --cov-report=html --cov-report=term
    echo.
    echo 覆盖率报告已生成: htmlcov\index.html
) else (
    echo ==========================================
    echo 运行所有测试...
    echo ==========================================
    pytest -v
)

echo.
echo ==========================================
echo 测试完成！
echo ==========================================
pause
