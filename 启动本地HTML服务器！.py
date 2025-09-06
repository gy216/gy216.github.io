import http.server
import socketserver
import time

PORT = 10086
HOST = "127.0.0.1"
print("端口设置成功，服务器在端口“10086”上运行")
time.sleep(0.5)
print("主机设置成功")
time.sleep(0.5)
print("启动服务器……")
# 启动服务器
with socketserver.TCPServer((HOST, PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"服务器已启动，访问 http://{HOST}:{PORT}")
    print(f"服务器端口：10086")
    print(f"服务器信息")
    print(f"————————————————————————————————")
    httpd.serve_forever()
