import os
import subprocess
import tkinter as tk
from tkinter import messagebox

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

        self.is_dns_ping_running = False
        self.is_direct_ping_running = False

    def start_dns_ping(self):
        if not self.is_dns_ping_running:
            self.is_dns_ping_running = True
            self.dns_button.config(state="disabled")
            self.direct_button.config(state="disabled")
            self.label.config(text="DNS加速模式已启动，持续ping中...")
            self.label.config(text="GY和gzw的都能用")
            self.dns_ping_process = subprocess.Popen(["ping", "s2.wemc.cc"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            self.master.after(100, self.check_dns_ping_output)

    def start_direct_ping(self):
        if not self.is_direct_ping_running:
            self.is_direct_ping_running = True
            self.dns_button.config(state="disabled")
            self.direct_button.config(state="disabled")
            self.label.config(text="直连加速模式已启动，持续ping中...")
            self.label.config(text="GY和gzw的都能用")
            self.direct_ping_process = subprocess.Popen(["ping", "s2.wemc.cc"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            self.master.after(100, self.check_direct_ping_output)

    def stop_ping(self):
        if self.is_dns_ping_running:
            self.is_dns_ping_running = False
            self.dns_button.config(state="normal")
            self.direct_button.config(state="normal")
            self.label.config(text="")
            self.dns_ping_process.terminate()
        elif self.is_direct_ping_running:
            self.is_direct_ping_running = False
            self.dns_button.config(state="normal")
            self.direct_button.config(state="normal")
            self.label.config(text="")
            self.direct_ping_process.terminate()

    def check_dns_ping_output(self):
        if self.is_dns_ping_running:
            output = self.dns_ping_process.stdout.readline()
            if output:
                self.label.config(text=output.decode("utf-8", errors="ignore"))
            self.master.after(100, self.check_dns_ping_output)

    def check_direct_ping_output(self):
        if self.is_direct_ping_running:
            output = self.direct_ping_process.stdout.readline()
            if output:
                self.label.config(text=output.decode("utf-8", errors="ignore"))
            self.master.after(100, self.check_direct_ping_output)

def main():
    root = tk.Tk()
    app = PingApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()