#!/usr/bin/env python3
"""
GraphMemory WebUI 自动更新脚本
用于从 GitHub Releases 下载最新的 WebUI 构建产物
"""

import json
import shutil
import sys
import tarfile
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

GITHUB_REPO = "lxfight/astrbot_plugin_GraphMemory"
GITHUB_API = f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
PLUGIN_DIR = Path(__file__).parent.parent
RESOURCES_DIR = PLUGIN_DIR / "resources"
BACKUP_DIR = PLUGIN_DIR / "resources_backup"


def get_latest_release():
    """获取最新 Release 信息"""
    print("🔍 检查最新版本...")
    try:
        req = Request(GITHUB_API, headers={"User-Agent": "AstrBot-GraphMemory-Updater"})
        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data
    except (URLError, HTTPError) as e:
        print(f"❌ 无法获取 Release 信息: {e}")
        sys.exit(1)


def download_asset(url, filename):
    """下载 Release 资源"""
    print(f"📥 下载 {filename}...")
    try:
        req = Request(url, headers={
            "User-Agent": "AstrBot-GraphMemory-Updater",
            "Accept": "application/octet-stream"
        })
        with urlopen(req, timeout=30) as response:
            with open(filename, "wb") as f:
                f.write(response.read())
        print(f"✅ 下载完成: {filename}")
        return True
    except Exception as e:
        print(f"❌ 下载失败: {e}")
        return False


def backup_current():
    """备份当前 resources 目录"""
    if RESOURCES_DIR.exists():
        print("💾 备份当前 WebUI...")
        if BACKUP_DIR.exists():
            shutil.rmtree(BACKUP_DIR)
        shutil.copytree(RESOURCES_DIR, BACKUP_DIR)
        print(f"✅ 备份完成: {BACKUP_DIR}")


def extract_and_replace(archive_path):
    """解压并替换 resources 目录"""
    print("📦 解压新版本...")
    try:
        # 删除旧的 resources
        if RESOURCES_DIR.exists():
            shutil.rmtree(RESOURCES_DIR)

        # 解压
        with tarfile.open(archive_path, "r:gz") as tar:
            tar.extractall(PLUGIN_DIR)

        print("✅ 更新完成！")
        return True
    except Exception as e:
        print(f"❌ 解压失败: {e}")
        # 恢复备份
        if BACKUP_DIR.exists():
            print("🔄 恢复备份...")
            if RESOURCES_DIR.exists():
                shutil.rmtree(RESOURCES_DIR)
            shutil.copytree(BACKUP_DIR, RESOURCES_DIR)
            print("✅ 已恢复到更新前状态")
        return False


def main():
    print("=" * 50)
    print("GraphMemory WebUI 更新工具")
    print("=" * 50)

    # 获取最新版本
    release = get_latest_release()
    version = release.get("tag_name", "unknown")
    print(f"📌 最新版本: {version}")

    # 查找 webui 资源
    assets = release.get("assets", [])
    webui_asset = None
    for asset in assets:
        if asset["name"].startswith("webui-") and asset["name"].endswith(".tar.gz"):
            webui_asset = asset
            break

    if not webui_asset:
        print("❌ 未找到 WebUI 构建产物")
        sys.exit(1)

    print(f"📦 资源文件: {webui_asset['name']}")
    print(f"📏 文件大小: {webui_asset['size'] / 1024 / 1024:.2f} MB")

    # 确认更新
    confirm = input("\n是否继续更新？(y/N): ").strip().lower()
    if confirm != "y":
        print("❌ 取消更新")
        sys.exit(0)

    # 备份
    backup_current()

    # 下载
    archive_path = PLUGIN_DIR / webui_asset["name"]
    if not download_asset(webui_asset["browser_download_url"], archive_path):
        sys.exit(1)

    # 解压替换
    if extract_and_replace(archive_path):
        # 清理
        archive_path.unlink()
        if BACKUP_DIR.exists():
            shutil.rmtree(BACKUP_DIR)
        print("\n" + "=" * 50)
        print("🎉 WebUI 更新成功！")
        print("=" * 50)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
