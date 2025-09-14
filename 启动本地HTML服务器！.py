import http.server
import socketserver
from threading import Thread

class OptimizedHTTPHandler(http.server.SimpleHTTPRequestHandler):
    # 禁用日志输出（减少IO开销）
    def log_message(self, format, *args):
        pass
    
    # 启用持久连接
    protocol_version = 'HTTP/1.1'
    
    # 优化缓冲区大小
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.wbufsize = 4096  # 增大写缓冲区

# 使用线程池
PORT = 9178
httpd = socketserver.ThreadingTCPServer(("", PORT), OptimizedHTTPHandler)
httpd.socket.setsockopt(socketserver.socket.SOL_SOCKET, socketserver.socket.SO_REUSEADDR, 1)

print(f"⚡ 优化版服务器启动: http://127.0.0.1:{PORT}")
httpd.serve_forever()