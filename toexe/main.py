import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QMessageBox
import os
from pathlib import PureWindowsPath
from Ui_py2exe import Ui_MainWindow  # 确保这个路径与您的文件结构相匹配
print("欢迎使用果园的打包工具")
print("版本3.0，内核2.0")
print("首次运行请运行CMD")
print("产品已激活：gyMiMars18h16l34lsv31k588")
print("打包愉快！")
class MainWindow(QMainWindow, Ui_MainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.setupUi(self)  # 使用Ui_MainWindow的setupUi方法初始化界面

    
    def dabao(self):
        # 打包逻辑
        fullpath = self.lineEdit.text()
        f = PureWindowsPath(fullpath)
        filedir = fullpath.replace(f.name, "")
        if self.checkBox.isChecked():
            command = "cd " + filedir + " && pyinstaller -F -w " + fullpath
        else:
            command = "cd " + filedir + " && pyinstaller -F " + fullpath
        
        result = os.system(command)
        if result == 0:
            QMessageBox.about(self, "执行结果", "恭喜！成功打包exe")
            print("打包成功")
        else:
            QMessageBox.about(self, "执行结果", "错误，请运行CMD文件，还不行找果园")
            print("打包失败")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWindow = MainWindow()  # 创建窗口实例
    mainWindow.pushButton_2.clicked.connect(mainWindow.dabao)  # 连接按钮点击事件
    mainWindow.show()
    sys.exit(app.exec_())
