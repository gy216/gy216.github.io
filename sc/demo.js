// Name: 弹窗扩展
// ID: popupExtension
// Description: 提供多种弹窗功能
// By: YourName <your@email.com>
// License: MIT

(function(Scratch) {
    'use strict';

    class PopupExtension {
        constructor() {
            // 初始化代码
        }

        getInfo() {
            return {
                id: 'popupExtension',
                name: '弹窗扩展',
                color1: '#FF8C00',
                color2: '#FFA500',
                blocks: [
                    {
                        opcode: 'showAlert',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示弹窗 [CONTENT]',
                        arguments: {
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你好，世界！'
                            }
                        }
                    },
                    {
                        opcode: 'showPrompt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '询问输入 [QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你叫什么名字？'
                            }
                        }
                    },
                    {
                        opcode: 'showConfirm',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '确认 [QUESTION]',
                        arguments: {
                            QUESTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '你确定要继续吗？'
                            }
                        }
                    },
                    {
                        opcode: 'showNotification',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '显示通知 标题 [TITLE] 内容 [CONTENT]',
                        arguments: {
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '通知'
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '这是一条通知'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'isNotificationAllowed',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '是否允许通知？'
                    }
                ]
            };
        }

        showAlert(args) {
            const content = Scratch.Cast.toString(args.CONTENT);
            alert(content);
        }

        showPrompt(args) {
            const question = Scratch.Cast.toString(args.QUESTION);
            return prompt(question) || '';
        }

        showConfirm(args) {
            const question = Scratch.Cast.toString(args.QUESTION);
            return confirm(question);
        }

        async showNotification(args) {
            const title = Scratch.Cast.toString(args.TITLE);
            const content = Scratch.Cast.toString(args.CONTENT);
            
            // 请求通知权限
            if (Notification.permission !== 'granted') {
                await Notification.requestPermission();
            }
            
            if (Notification.permission === 'granted') {
                new Notification(title, { body: content });
            }
        }

        isNotificationAllowed() {
            return Notification.permission === 'granted';
        }
    }

    Scratch.extensions.register(new PopupExtension());
})(Scratch);