import tkinter as tk  
from tkinter import messagebox  
import subprocess  
import threading  
import time  
import requests  # 导入requests库  
  
class PingApp:  
    def __init__(self, root):  
        self.root = root  
        self.root.title("果园编程服务器加速器")  
  
        self.ping_process = None  
        self.ping_running = False  
        self.ping_start_time = None  
  
        self.dns_button = tk.Button(root, text='DNS加速', command=self.start_dns_ping)  
        self.dns_button.pack(pady=10)  
  
        self.direct_button = tk.Button(root, text='直连IP加速', command=self.start_direct_ping)  
        self.direct_button.pack(pady=10)  
  
        self.advanced_button = tk.Button(root, text='高级加速', command=self.start_advanced_acceleration)  
        self.advanced_button.pack(pady=10)

        self.advanced_button = tk.Button(root, text='高级加速GZW', command=self.start_advanced_acceleration1)  
        self.advanced_button.pack(pady=10)  
  
        self.stop_button = tk.Button(root, text='停止', command=self.stop_ping)  
        self.stop_button.pack(pady=10)  
  
        self.status_var = tk.StringVar()  
        self.status_label = tk.Label(root, textvariable=self.status_var, width=50)  
        self.status_label.pack(pady=20)  
  
        self.update_status("                准备就绪，果园和gzw的服务器都能用                ")  
  
    def start_ping(self, target):  
        if self.ping_running:  
            self.stop_ping()  
  
        def run_ping():  
            self.ping_start_time = time.time()  
            try:  
                self.ping_process = subprocess.Popen(['ping', '-t', target], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)  
                self.ping_running = True  
                self.update_status(f"{target} 加速模式已启动，正在加速...")  
                while self.ping_process.poll() is None:  
                    elapsed_time = time.time() - self.ping_start_time  
                    minutes, seconds = divmod(elapsed_time, 60)  
                    self.update_status(f"{target} 加速模式已启动，已运行 {int(minutes)} 分 {int(seconds)} 秒...")  
                    time.sleep(1)  
            except Exception as e:  
                self.update_status(f"启动ping失败: {e}")  
                self.ping_running = False  
  
        thread = threading.Thread(target=run_ping)  
        thread.start()  
  
    def start_dns_ping(self):  
        self.start_ping('s2.wemc.cc')  
  
    def start_direct_ping(self):  
        self.start_ping('110.40.71.170')  
  
    def start_advanced_acceleration(self):  
        try:  
            response = requests.get('http://s2.wemc.cc:14259/')  
            self.update_status(f"高级加速成功，服务器响应状态码：{response.status_code}")  
        except requests.exceptions.RequestException as e:  
            self.update_status(f"高级加速失败：{e}")
            
    def start_advanced_acceleration1(self):  
        try:  
            response = requests.get('http://s2.wemc.cc:13076/')  
            self.update_status(f"高级加速成功，服务器响应状态码：{response.status_code}")  
        except requests.exceptions.RequestException as e:  
            self.update_status(f"高级加速失败：{e}")  
  
    def stop_ping(self):  
        if self.ping_process:  
            self.ping_process.terminate()  
            self.ping_process.wait()  
            self.ping_process = None  
            self.ping_running = False  
            self.update_status("                Ping 已停止                ")  
  
    def update_status(self, message):  
        self.status_var.set(message)  
  
if __name__ == "__main__":  
    root = tk.Tk()  
    app = PingApp(root)  
    root.mainloop()
