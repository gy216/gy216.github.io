from tkinter import *
from tkinter.filedialog import *
from tkinter.messagebox import *
import os

filename = ""

def author():
    showinfo(title="作者", message="果园")
    
def about():
    showinfo(title="关于", message="记事本-3.3.0-果园编程版权所有")

def power():
    showinfo(title="版权信息", message="果园编程版权所有")

def mynew():
    global top, filename, textPad
    top.title("未命名文件")
    filename = None
    textPad.delete(1.0, END)

def myopen():
    global filename
    filename = askopenfilename(defaultextension=".txt")
    if filename == "":
        filename = None
    else:
        top.title("记事本" + os.path.basename(filename))
        textPad.delete(1.0, END)
        with open(filename, 'r') as f:
            textPad.insert(1.0, f.read())

def mysave():
    global filename
    try:
        with open(filename, 'w') as f:
            f.write(textPad.get(1.0, 'end'))
    except:
        mysaveas()

def mysaveas():
    global filename
    f = asksaveasfilename(initialfile="未命名.txt", defaultextension=".txt")
    filename = f
    with open(f, 'w') as fh:
        fh.write(textPad.get(1.0, END))
    top.title("记事本 " + os.path.basename(f))

def cut():
    textPad.event_generate("<<Cut>>")

def copy():
    textPad.event_generate("<<Copy>>")

def paste():
    textPad.event_generate("<<Paste>>")

def undo():
    textPad.event_generate("<<Undo>>")

def redo():
    textPad.event_generate("<<Redo>>")

def select_all():
    textPad.tag_add("sel", "1.0", "end")

def find():
    t = Toplevel(top)
    t.title("查找")
    t.geometry("260x60+200+250")
    t.transient(top)
    Label(t, text="查找：").grid(row=0, column=0, sticky="e")
    v = StringVar()
    e = Entry(t, width=20, textvariable=v)
    e.grid(row=0, column=1, padx=2, pady=2, sticky="we")
    e.focus_set()
    c = IntVar()
    Checkbutton(t, text="不区分大小写", variable=c).grid(row=1, column=1, sticky='e')
    Button(t, text="查找所有", command=lambda: search(v.get(), c.get(), textPad, t, e)).grid(row=0, column=2, sticky="e" + "w", padx=2, pady=2)

    def close_search():
        textPad.tag_remove("match", "1.0", END)
        t.destroy()

    t.protocol("WM_DELETE_WINDOW", close_search)

def mypopup(event):
    editmenu.post(event.x_root, event.y_root)

def search(needle, cssnstv, textPad, t, e):
    textPad.tag_remove("match", "1.0", END)
    count = 0
    if needle:
        pos = "1.0"
        while True:
            pos = textPad.search(needle, pos, nocase=cssnstv, stopindex=END)
            if not pos:
                break
            lastpos = f"{pos}+{len(needle)}c"
            textPad.tag_add("match", pos, lastpos)
            count += 1
            pos = lastpos
        textPad.tag_config('match', foreground='yellow', background="green")
        e.focus_set()
        t.title(f"{count} 个被匹配")

top = Tk()
top.title("记事本")
top.geometry("600x400+100+50")

menubar = Menu(top)

# 文件功能
filemenu = Menu(menubar, tearoff=0)
filemenu.add_command(label="新建", accelerator="Ctrl+N", command=mynew)
filemenu.add_command(label="打开", accelerator="Ctrl+O", command=myopen)
filemenu.add_command(label="保存", accelerator="Ctrl+S", command=mysave)
filemenu.add_command(label="另存为", accelerator="Ctrl+Shift+S", command=mysaveas)
menubar.add_cascade(label="文件", menu=filemenu)

# 编辑功能
editmenu = Menu(menubar, tearoff=0)
editmenu.add_command(label="撤销", accelerator="Ctrl+Z", command=undo)
editmenu.add_command(label="重做", accelerator="Ctrl+Y", command=redo)
editmenu.add_separator()
editmenu.add_command(label="剪切", accelerator="Ctrl+X", command=cut)
editmenu.add_command(label="复制", accelerator="Ctrl+C", command=copy)
editmenu.add_command(label="粘贴", accelerator="Ctrl+V", command=paste)
editmenu.add_separator()
editmenu.add_command(label="查找", accelerator="Ctrl+F", command=find)
editmenu.add_command(label="全选", accelerator="Ctrl+A", command=select_all)
menubar.add_cascade(label="编辑", menu=editmenu)

# 关于 功能
aboutmenu = Menu(menubar, tearoff=0)
aboutmenu.add_command(label="作者", command=author)
aboutmenu.add_command(label="版权", command=power)
aboutmenu.add_command(label="关于", command=about)
menubar.add_cascade(label="关于", menu=aboutmenu)

top.config(menu=menubar)

textPad = Text(top, undo=True)
textPad.pack(expand=YES, fill=BOTH)
scroll = Scrollbar(textPad)
textPad.config(yscrollcommand=scroll.set)
scroll.config(command=textPad.yview)
scroll.pack(side=RIGHT, fill=Y)

# 热键绑定
textPad.bind("<Control-n>", lambda e: mynew())
textPad.bind("<Control-o>", lambda e: myopen())
textPad.bind("<Control-s>", lambda e: mysave())
textPad.bind("<Control-a>", lambda e: select_all())
textPad.bind("<Control-f>", lambda e: find())

textPad.bind("<Button-3>", mypopup)

top.mainloop()