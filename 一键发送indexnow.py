import requests
import json

url = "https://api.indexnow.org/IndexNow"
headers = {
    "Content-Type": "application/json; charset=utf-8"
}
data = {
    "host": "guoyuangzs.dpdns.org",
    "key": "57d90a4564104b3eabc6f8271dec863a",
    "keyLocation": "https://guoyuangzs.dpdns.org/57d90a4564104b3eabc6f8271dec863a.txt",
    "urlList": [
        "https://guoyuangzs.dpdns.org/",
        "https://guoyuangzs.dpdns.org/home",
        "https://guoyuangzs.dpdns.org/about"
    ]
}

try:
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("✅ 提交成功！Bing 已收到你的索引请求")
    else:
        print(f"⚠️ 提交失败，状态码: {response.status_code}")
        
except Exception as e:
    print(f"❌ 请求出错: {e}")
