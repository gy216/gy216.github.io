// 果园的AICHAT.JS
// JavaScript格式
// 感谢@上古米歇尔（2373460868）
// js编写@上古米歇尔（2373460868）
// 编译时间：2025年5月10日13点05分
// 开始
// ================================
// 配置区域：分离 API 配置和核心逻辑
const API_CONFIG = {
    qwen3: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'qwen/qwen3-235b-a22b:free'
    },
    dsv3: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'deepseek/deepseek-chat-v3-0324:free'
    },
    
    dsr1: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'deepseek/deepseek-r1-0528:free'
    },
    gemini: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'google/gemma-3-27b-it:free'
    },
    hunyuan: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'tencent/hunyuan-a13b-instruct:free'
    },
    kimidev: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'moonshotai/kimi-dev-72b:free'
        
    },
    kimisee: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'moonshotai/kimi-vl-a3b-thinking:free'
        
    },
    wrphi4: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'microsoft/phi-4-reasoning-plus:free'
    },
    qwen330b: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'qwen/qwen3-30b-a3b:free'
    },
    Llama: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free'
    },
    MXDS: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'tngtech/deepseek-r1t-chimera:free'
    },
    Dolphin: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free'
    },
    Mistral: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'mistralai/mistral-7b-instruct:free'
    },
     DeepHermes: {
        key: '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',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'nousresearch/deephermes-3-llama-3-8b-preview:free'
    },
};

// 系统消息初始化
let chatHistory = [
    {
        role: "system",
        content: "你是GYChat，由果园编程（果园工作室）训练的人工智能助手，运行在其他大模型之上。具备对话记忆功能，会逐步推理确保回答严谨。优先使用中文/英文交流，必须提供安全、准确、有用的回答，拒绝任何违法/暴力/歧视内容（禁止骂人）。表现取决于底层模型能力和提示词调教。GYChat为固定名称不可翻译。输出规范：普通文本用markdown，数学公式用LaTeX，图表用Mermaid timeline。可提供：官网https://gy216.github.io | QQ 386498317 | 编程群749914521"
    }
];

// DOM 元素引用：清晰地组织 UI 元素
const chatBody = document.querySelector('.chat-body');
const messageInput = document.getElementById('messageInput');
const apiSelector = document.getElementById('apiSelector');
const sendMessageButton = document.getElementById('sendMessage');
const clearChatButton = document.getElementById('clearChat');
const stopGeneratingButton = document.getElementById('stopGenerating');

// 工具函数区域：提取通用功能
function escapeHtml(text) {
    // 保留原有功能：转义 HTML 特殊字符
    return text.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

function createMessageElement(content, type) {
    // 创建消息元素的通用函数
    const element = document.createElement('div');
    element.classList.add('chat-message', type);
    element.style.padding = '10px';
    element.style.borderRadius = '5px';
    element.style.marginBottom = '10px';
    element.innerHTML = content;
    return element;
}

function appendMessage(text, type = 'ai-message', useConverter = true) {
    // 改进消息追加逻辑
    const converter = new showdown.Converter();
    let content;
    if (useConverter) {
        content = converter.makeHtml(text);
    } else {
        content = escapeHtml(text);
    }
    const messageElement = createMessageElement(content, type);
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
    return messageElement;
}

// 核心逻辑区域：组织主要业务流程
class ChatManager {
    constructor() {
        this.abortController = null;
        this.thinkingContent = '';
        this.finalContent = '';
        this.initEventListeners();
    }

    initEventListeners() {
        // 统一管理事件监听器
        sendMessageButton.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', e => e.key === 'Enter' && this.sendMessage());
        clearChatButton.addEventListener('click', () => this.clearChat());
        stopGeneratingButton.addEventListener('click', () => this.stopGenerating());
    }

    async sendMessage() {
        const rawMessage = messageInput.value.trim();
        if (!rawMessage) return;

        // 显示用户消息
        const userMessage = escapeHtml(rawMessage);
        chatBody.appendChild(createMessageElement(userMessage, 'user-message'));
        chatBody.scrollTop = chatBody.scrollHeight;
        messageInput.value = '';

        try {
            const selectedApi = apiSelector.value;
            await this.fetchApiResponse(rawMessage, selectedApi);
        } catch (error) {
            console.error('API 调用错误:', error);
            appendMessage(`请求失败: ${error.message || '未知错误'}`, 'ai-message');
        }
    }

    async fetchApiResponse(userMessage, modelType) {
        if (this.abortController) this.abortController.abort(); // 中断之前的请求
        this.abortController = new AbortController();

        // 初始化内容
        this.thinkingContent = '';
        this.finalContent = '';

        const config = API_CONFIG[modelType];
        const headers = new Headers({
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': encodeURIComponent(window.location.href),
            'X-Title': encodeURIComponent('果园AI测试')
        });

        // 更新聊天历史
        chatHistory.push({ role: "user", content: userMessage });

        try {
            const response = await fetch(config.url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: config.model,
                    messages: chatHistory,
                    temperature: 0.8,
                    stream: true
                }),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API 请求失败');
            }

            return this.handleStreamResponse(response);
        } catch (error) {
            if (error.name !== 'AbortError') throw error; // 忽略中止错误
        } finally {
            this.abortController = null;
        }
    }

    async handleStreamResponse(response) {
        const reader = response.body.getReader();
        let aiMessageId = `ai-message-${Date.now()}`;
        let aiMessageElement = null;

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                const lines = text.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    const jsonStr = line.replace(/^data: /, '');
                    if (jsonStr === '[DONE]') break;

                    try {
                        const data = JSON.parse(jsonStr);
                        const deltaContent = data.choices?.[0]?.delta?.content;
                        const deltaReasoning = data.choices?.[0]?.delta?.reasoning;

                        if (deltaReasoning) {
                            this.thinkingContent += deltaReasoning;
                        }

                        if (deltaContent) {
                            this.finalContent += deltaContent;
                        }

                        // 更新消息内容
                        const fullContent = this.thinkingContent ? `&lt;think&gt;${this.thinkingContent}&lt;/think&gt;\n${this.finalContent}` : this.finalContent;
                        if (!aiMessageElement) {
                            aiMessageElement = appendMessage('', 'ai-message');
                            aiMessageElement.id = aiMessageId;
                        }
                        aiMessageElement.innerHTML = new showdown.Converter().makeHtml(fullContent);

                        chatBody.scrollTop = chatBody.scrollHeight;
                    } catch (parseError) {
                        console.warn('JSON解析错误:', parseError);
                        console.log('尝试解析的字符串:', jsonStr);
                        console.log('接收到的非JSON内容:', line);
                    }
                }
            }

            // 保存完整回复到聊天历史
            if (this.finalContent) {
                chatHistory.push({ role: "assistant", content: this.finalContent });
            }
            return aiMessageId;
        } catch (error) {
            console.warn('流处理错误:', error);
        }
    }

    clearChat() {
        // 清空聊天界面，但保留系统消息和系统信息
        const messages = chatBody.querySelectorAll('.chat-message');
        messages.forEach(message => {
            if (!message.classList.contains('hints')) {
                message.remove();
            }
        });
        chatHistory = [chatHistory[0]]; // 保留系统初始化消息
    }

    stopGenerating() {
        // 中止当前生成
        if (this.abortController) {
            this.abortController.abort();
            appendMessage('生成已停止', 'ai-message');
        }
    }
}

// 初始化应用
const chatApp = new ChatManager();