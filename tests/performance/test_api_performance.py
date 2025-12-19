"""WebUI API 性能测试"""

import time

import pytest


@pytest.mark.slow
@pytest.mark.webui
def test_api_response_time(test_client):
    """测试 API 响应时间"""
    endpoints = [
        "/api/system/status",
        "/api/entities",
        "/api/relations",
        "/api/stats/overview",
    ]

    results = {}

    for endpoint in endpoints:
        times = []
        for _ in range(10):
            start = time.time()
            response = test_client.get(f"{endpoint}?key=test_key")
            elapsed = time.time() - start
            times.append(elapsed)
            assert response.status_code == 200

        avg_time = sum(times) / len(times)
        max_time = max(times)
        min_time = min(times)

        results[endpoint] = {
            "avg": avg_time,
            "max": max_time,
            "min": min_time,
        }

        print(f"\n{endpoint}:")
        print(f"  平均: {avg_time*1000:.2f}ms")
        print(f"  最大: {max_time*1000:.2f}ms")
        print(f"  最小: {min_time*1000:.2f}ms")

        # 性能断言
        assert avg_time < 0.5, f"{endpoint} 平均响应时间过长: {avg_time:.2f}s"


@pytest.mark.slow
@pytest.mark.webui
def test_concurrent_api_requests(test_client):
    """测试并发 API 请求"""
    import concurrent.futures

    def make_request():
        response = test_client.get("/api/system/status?key=test_key")
        return response.status_code == 200

    start_time = time.time()

    # 并发 20 个请求
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(20)]
        results = [f.result() for f in concurrent.futures.as_completed(futures)]

    elapsed = time.time() - start_time

    print(f"\n并发 20 个请求耗时: {elapsed:.2f}s")
    print(f"成功率: {sum(results)}/{len(results)}")

    assert all(results), "部分请求失败"
    assert elapsed < 5.0, f"并发请求耗时过长: {elapsed:.2f}s"


@pytest.mark.slow
@pytest.mark.webui
def test_large_data_export(test_client):
    """测试大数据导出性能"""
    start_time = time.time()

    response = test_client.get("/api/system/export?key=test_key")

    elapsed = time.time() - start_time

    print(f"\n导出数据耗时: {elapsed:.2f}s")

    assert response.status_code == 200
    assert elapsed < 3.0, f"导出耗时过长: {elapsed:.2f}s"
