import subprocess  
import tkinter as tk  
  
class PingApp:  
    def __init__(self, master):  
        self.master = master  
        master.title("DNS加速/直连加速")  
  
        self.dns_button = tk.Button(master, text="DNS加速", command=self.start_dns_ping)  
        self.dns_button.pack()  
  
        self.direct_button = tk.Button(master, text="直连", command=self.start_direct_ping)  
        self.direct_button.pack()  
  
        self.stop_button = tk.Button(master, text="停止", command=self.stop_ping)  
        self.stop_button.pack()  
  
        self.label = tk.Label(master, text="")  
        self.label.pack()  
  
        self.dns_ping_process = None  
        self.direct_ping_process = None  
  
    def start_ping(self, target, process_var):  
        if process_var is not None and process_var.poll() is None:  
            messagebox.showerror("错误", "已有ping进程在运行")  
            return  
          
        process_var = subprocess.Popen(["ping", "-t", target], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)  
        setattr(self, process_var.__class__.__name__.lower() + "_ping_process", process_var)  
        self.update_label(f"{target} 加速模式已启动，持续ping中...")  
        self.disable_buttons()  
        self.master.after(100, self.check_ping_output, process_var)  
  
    def stop_ping(self):  
        for attr in ['dns_ping_process', 'direct_ping_process']:  
            process = getattr(self, attr, None)  
            if process and process.poll() is None:  
                process.terminate()  
                try:  
                    process.wait(timeout=1)  
                except subprocess.TimeoutExpired:  
                    pass  
                setattr(self, attr, None)  
        self.update_label("")  
        self.enable_buttons()  
  
    def check_ping_output(self, process):  
        if process.poll() is None:  
            line = process.stdout.readline()  
            if line:  
                self.update_label(line.decode("utf-8", errors="ignore").strip())  
            self.master.after(100, self.check_ping_output, process)  
  
    def update_label(self, text):  
        self.label.config(text=text)  
  
    def disable_buttons(self):  
        self.dns_button.config(state="disabled")  
        self.direct_button.config(state="disabled")  
  
    def enable_buttons(self):  
        self.dns_button.config(state="normal")  
        self.direct_button.config(state="normal")  
  
    def start_dns_ping(self):  
        self.start_ping("s2.wemc.cc", self.dns_ping_process)  
  
    def start_direct_ping
