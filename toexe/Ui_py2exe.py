from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtCore import QPropertyAnimation
from PyQt5.QtWidgets import QFileDialog

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(650, 350)

        self.centralwidget = QtWidgets.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")

        self.layout = QtWidgets.QVBoxLayout(self.centralwidget)

        self.label = QtWidgets.QLabel("Py文件完整路径（不支持中文）：")
        self.layout.addWidget(self.label)

        self.lineEdit = QtWidgets.QLineEdit(self.centralwidget)
        self.layout.addWidget(self.lineEdit)

        # 浏览按钮
        self.browseButton = QtWidgets.QPushButton("浏览以选择Python文件")
        self.browseButton.clicked.connect(self.openFileDialog)  # 连接信号和槽
        self.layout.addWidget(self.browseButton)

        self.checkBox = QtWidgets.QCheckBox("要隐藏CMD窗口，如果有print请慎重选择")
        self.layout.addWidget(self.checkBox)

        self.label_2 = QtWidgets.QLabel("（可选，最好选下，不然很丑）图标路径：")
        self.layout.addWidget(self.label_2)

        self.lineEdit_2 = QtWidgets.QLineEdit(self.centralwidget)
        self.layout.addWidget(self.lineEdit_2)

        self.pushButton_2 = QtWidgets.QPushButton("打包！")
        self.layout.addWidget(self.pushButton_2)  # 添加按钮到布局

        self.label_3 = QtWidgets.QLabel("exe保存路径为源文件所在文件夹的dist目录里")
        font = QtGui.QFont()
        font.setPointSize(15)
        self.label_3.setFont(font)
        self.layout.addWidget(self.label_3)

        self.label_admin = QtWidgets.QLabel("请使用管理员运行这个程序")
        self.label_admin.setStyleSheet("color: red; font-weight: bold;")
        self.layout.addWidget(self.label_admin)

        self.label_custom = QtWidgets.QLabel("（运行之前请运行CMD文件）")
        self.layout.addWidget(self.label_custom)

        self.label_custom = QtWidgets.QLabel("（最好新建一个文件夹，把PY文件放进去，用原地址可能很乱（记得，文件夹不是中文））")
        self.layout.addWidget(self.label_custom)

        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

        self.apply_style()
        self.setup_button_animation(self.pushButton_2)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "果园编程专用PY打包程序3.0.3"))
        self.label.setText(_translate("MainWindow", "Py文件完整路径（不支持中文）："))
        self.checkBox.setText(_translate("MainWindow", "要隐藏CMD窗口"))
        self.pushButton_2.setText(_translate("MainWindow", "打包！"))
        self.label_2.setText(_translate("MainWindow", "（可选）图标路径："))
        self.label_3.setText(_translate("MainWindow", "exe保存路径为源文件所在文件夹的dist目录里"))

    def apply_style(self):
        style = """
        QWidget {
            background-color: #f4f4f4;
        }
        QLabel {
            color: #333;
            font: 10pt;
        }
        QLineEdit {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 2px;
            font: 10pt;
        }
        QPushButton {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px;
        }
        QPushButton:hover {
            background-color: #45a049;
        }
        QCheckBox {
            color: #333;
            font: 10pt;
        }
        """
        self.centralwidget.setStyleSheet(style)

    def setup_button_animation(self, button):
        animation = QPropertyAnimation(button, b"scale")
        animation.setDuration(300)
        animation.setStartValue(QtCore.QPointF(1, 1))
        animation.setEndValue(QtCore.QPointF(1.1, 1.1))
        animation.setDirection(QPropertyAnimation.Forward)
        self.animation = animation  # 保存引用以避免垃圾回收
        button.clicked.connect(lambda: animation.start())

    def openFileDialog(self):
        options = QFileDialog.Options()
        fileName, _ = QFileDialog.getOpenFileName(self, "选择Py文件（请确保路径里没有除了英文外的所有语言）", "",
                                                  "你的PYTHON文件 (*.py)", options=options)
        if fileName:
            self.lineEdit.setText(fileName)

# 测试代码
if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    # 连接打包按钮的点击信号到一个示例槽函数，您需要替换为您自己的打包逻辑
    MainWindow.pushButton_2.clicked.connect(ui.dabao)  
    MainWindow.show()
    sys.exit(app.exec_())

# 假设的打包方法，您需要实现自己的打包逻辑
def dabao(self):
    print("打包按钮被点击了，实现打包逻辑...")
