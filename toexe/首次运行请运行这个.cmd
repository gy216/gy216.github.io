@echo off
echo 正在升级PIP
python -m pip install --upgrade pip

echo PIP已升级
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
echo 清华镜像已设置
echo 正在安装pyqt5
pip install PyQt5                   

pip install PyQt5-tools

pip install PyQt5Designer 
 
pip install PyQtWebEngine
 
pip install PySimpleGUI
 
pip install PyQt5-sip
 
pip install PyQt5-stubs

echo pyqt5安装成功
echo =================================
echo 正在安装pyinstaller
pip install pyinstaller


echo所有东西已安装完成，现在，你可以关闭窗口，打开文件了
