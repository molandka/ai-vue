<template>
    <div class="consultation-container">
        <div class="consultation-row">
            <div class="consultation-col consultation-col-sidebar" :class="{ show: showSidebar }">
                <div class="sidebar">
                    <div class="ai-assistant-info">
                        <div class="avatar-wrapper">
                            <img :src="iconUrl" alt="logo" class="assistant-icon">
                            <span class="online-dot"></span>
                        </div>
                        <div class="assistant-detail">
                            <h3 class="assistant-name">宁波AI助手</h3>
                            <div class="assistant-status">
                                <span class="status-icon"></span>
                                在线服务中
                            </div>
                        </div>
                    </div>
                    <div class="sidebar-divider"></div>
                    <div class="quick-topics">
                        <p class="topics-title">快捷咨询</p>
                        <el-button 
                            v-for="topic in quickTopics" 
                            :key="topic"
                            size="small"
                            class="topic-btn"
                            @click="sendQuickTopic(topic)"
                        >
                            {{ topic }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="sidebar-overlay" v-if="showSidebar" @click="showSidebar = false"></div>
            <div class="consultation-col consultation-col-main">
                <div class="consultation-right">
                    <div class="chat-header">
                        <div class="header-left">
                            <button class="mobile-menu-btn" @click="showSidebar = true">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <div class="header-info">
                                <img :src="iconUrl" alt="logo" class="header-icon">
                                <span class="header-title">宁波AI助手</span>
                            </div>
                        </div>
                        <div class="header-actions">
                            <el-button size="small" type="primary" @click="createNewConversation">
                                新建对话
                            </el-button>
                            <el-button size="small" type="text" @click="clearChat">
                                清空对话
                            </el-button>
                        </div>
                    </div>
                    <div class="chat-main" ref="chatContainer">
                        <div v-if="chatMessages.length === 0" class="welcome-panel">
                            <div class="welcome-icon">
                                <img :src="iconUrl" alt="logo">
                            </div>
                            <h3 class="welcome-title">欢迎来到宁波AI助手</h3>
                            <p class="welcome-desc">您可以与我进行咨询，我会尽力为您解答问题</p>
                            <div class="welcome-tips">
                                <span>💡 提示：点击左侧快捷咨询开始对话，或直接在下方输入您的问题</span>
                            </div>
                        </div>
                        <div v-else class="message-list">
                            <div 
                                v-for="(msg, index) in chatMessages" 
                                :key="index"
                                :class="['message-item', msg.type]"
                            >
                                <img :src="iconUrl" alt="avatar" class="message-avatar" />
                                <div class="message-content">
                                    <div class="message-bubble">
                                        <p v-if="msg.type === 'user'">{{ msg.content }}</p>
                                        <div v-else class="ai-content">
                                            <span v-html="formatMarkdown(msg.content)"></span>
                                            <span v-if="msg.isStreaming" class="typing-indicator">
                                                <span></span><span></span><span></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="message-time">{{ msg.time }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <el-input 
                            v-model="inputMessage"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入您的问题..."
                            class="chat-input"
                            :disabled="isTyping"
                            @keydown.enter.exact.prevent="sendMessage"
                        />
                        <div class="input-actions">
                            <el-button 
                                type="primary" 
                                class="send-btn"
                                @click="sendMessage"
                                :disabled="!inputMessage.trim() || isTyping"
                            >
                                {{ isTyping ? '思考中...' : '发送' }}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { psychologicalChatStream, startNewSession } from '../api/admin'

const iconUrl = new URL('../assets/logo.png', import.meta.url).href
const chatMessages = ref([])
const inputMessage = ref('')
const chatContainer = ref(null)
const sessionId = ref(null)
const userMessage = ref(null)
const isTyping = ref(false)
const showSidebar = ref(false)

const quickTopics = [
    '如何缓解焦虑',
    '情绪管理技巧',
    '睡眠改善建议',
    '压力应对方法'
]

const createNewSession = async (initialMessage) => {
    try {
        const sessionTitle = initialMessage.slice(0, 20) + (initialMessage.length > 20 ? '...' : '')
        const res = await startNewSession(initialMessage, sessionTitle)
        sessionId.value = res.sessionId
        return res
    } catch (error) {
        console.error('创建会话失败:', error)
        ElMessage.error('创建会话失败')
        throw error
    }
}

const sendMessage = async () => {
    if (!inputMessage.value.trim() || isTyping.value) return
    
    const userMsg = {
        type: 'user',
        content: inputMessage.value.trim(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    chatMessages.value.push(userMsg)
    const currentMessage = inputMessage.value.trim()
    inputMessage.value = ''
    
    scrollToBottom()
    
    if (!sessionId.value) {
        try {
            await createNewSession(currentMessage)
        } catch (error) {
            return
        }
    }
    
    await streamChat(currentMessage)
}

const streamChat = async (userMessage) => {
    isTyping.value = true
    
    const aiMsg = ref({
        type: 'ai',
        content: '',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
    })
    chatMessages.value.push(aiMsg.value)
    
    try {
        await psychologicalChatStream(
            sessionId.value, 
            userMessage,
            (content) => {
                aiMsg.value.content += content
                chatMessages.value = [...chatMessages.value]
                nextTick(() => {
                    scrollToBottom()
                })
            },
            (error) => {
                console.error('流式对话错误:', error)
            }
        )
        
        aiMsg.value.isStreaming = false
        chatMessages.value = [...chatMessages.value]
        
    } catch (error) {
        console.error('流式对话错误:', error)
        aiMsg.value.content = '抱歉，发生了错误，请稍后再试。'
        aiMsg.value.isStreaming = false
        chatMessages.value = [...chatMessages.value]
        ElMessage.error('发送消息失败')
    } finally {
        isTyping.value = false
    }
}

const formatMarkdown = (text) => {
    if (!text) return ''
    return text
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
}

const sendQuickTopic = (topic) => {
    if (isTyping.value) {
        ElMessage.warning('请等待当前回复完成')
        return
    }
    inputMessage.value = topic
    sendMessage()
}

const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
    })
}

const clearChat = () => {
    chatMessages.value = []
    sessionId.value = null
    ElMessage.success('对话已清空')
}

const createNewConversation = () => {
    clearChat()
}
</script>

<style>
.consultation-container {
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    box-sizing: border-box;
}

.consultation-row {
    display: flex;
    gap: 10px;
    height: 100%;
}

.consultation-col {
    display: flex;
    flex-direction: column;
}

.consultation-col-sidebar {
    width: calc(100% / 3);
}

.consultation-col-main {
    width: calc(200% / 3);
}

.sidebar {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 20px;
    height: calc(100vh - 40px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.ai-assistant-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 20px;
}

.avatar-wrapper {
    position: relative;
}

.assistant-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.online-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: #10b981;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 4px rgba(16, 185, 129, 0.5);
}

.assistant-detail {
    flex: 1;
}

.assistant-name {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.assistant-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #10b981;
}

.status-icon {
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.sidebar-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
    margin: 15px 0;
}

.quick-topics {
    padding-top: 10px;
}

.topics-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 6px;
}

.topics-title::before {
    content: '';
    width: 4px;
    height: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
}

.topic-btn {
    display: block;
    width: 100%;
    margin-bottom: 8px;
    text-align: left;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border: none;
    color: #374151;
    transition: all 0.2s ease;
    border-radius: 10px;
    padding: 10px 14px;
}

.topic-btn:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.consultation-right {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 40px);
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mobile-menu-btn {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 18px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}

.mobile-menu-btn span {
    width: 100%;
    height: 2px;
    background: #374151;
    border-radius: 1px;
    transition: all 0.2s ease;
}

.header-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
}

.header-actions {
    display: flex;
    gap: 8px;
}

.chat-main {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f9fafb;
}

.chat-main::-webkit-scrollbar {
    width: 6px;
}

.chat-main::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
}

.chat-main::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.chat-main::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.welcome-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
}

.welcome-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.welcome-icon img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.welcome-title {
    margin: 0 0 12px 0;
    font-size: 26px;
    font-weight: 700;
    color: #1f2937;
}

.welcome-desc {
    margin: 0 0 20px 0;
    font-size: 15px;
    color: #6b7280;
    line-height: 1.6;
}

.welcome-tips {
    padding: 14px 24px;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 12px;
    font-size: 13px;
    color: #16a34a;
    border: 1px solid #bbf7d0;
}

.message-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.message-item {
    display: flex;
    gap: 14px;
}

.message-item.user {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-content {
    max-width: 70%;
}

.message-bubble {
    padding: 14px 18px;
    border-radius: 20px;
    margin-bottom: 6px;
    transition: all 0.2s ease;
}

.message-item.ai .message-bubble {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px 20px 20px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.message-item.user .message-bubble {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px 6px 20px 20px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.message-item.user .message-bubble:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.ai-content {
    line-height: 1.7;
    color: #374151;
    font-size: 14px;
}

.ai-content code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 13px;
    color: #ef4444;
}

.typing-indicator {
    display: inline-flex;
    gap: 5px;
    margin-left: 8px;
    vertical-align: middle;
}

.typing-indicator span {
    width: 7px;
    height: 7px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
}

.message-time {
    font-size: 12px;
    color: #9ca3af;
    padding: 0 10px;
}

.message-item.user .message-time {
    text-align: right;
}

.chat-input-area {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    background: white;
}

.chat-input {
    border-radius: 14px;
    border-color: #e5e7eb;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.chat-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.input-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.send-btn {
    border-radius: 10px;
    padding: 10px 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-weight: 500;
    transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.send-btn:active:not(:disabled) {
    transform: translateY(0);
}

.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
}

@media screen and (max-width: 768px) {
    .consultation-container {
        padding: 8px;
    }
    
    .consultation-row {
        gap: 0;
    }
    
    .consultation-col-sidebar {
        position: fixed;
        left: -280px;
        top: 0;
        z-index: 100;
        width: 280px;
        height: 100vh;
        transition: left 0.3s ease;
        padding: 16px;
        box-sizing: border-box;
    }
    
    .consultation-col-sidebar.show {
        left: 0;
    }
    
    .sidebar-overlay.show {
        display: block;
    }
    
    .consultation-col-main {
        width: 100%;
    }
    
    .sidebar {
        height: calc(100vh - 32px);
        border-radius: 16px;
    }
    
    .consultation-right {
        height: calc(100vh - 16px);
        border-radius: 12px;
    }
    
    .mobile-menu-btn {
        display: flex;
    }
    
    .chat-header {
        padding: 12px 16px;
    }
    
    .header-title {
        font-size: 15px;
    }
    
    .chat-main {
        padding: 12px;
    }
    
    .message-content {
        max-width: 85%;
    }
    
    .message-bubble {
        padding: 12px 16px;
        border-radius: 16px;
    }
    
    .message-item.ai .message-bubble {
        border-radius: 4px 16px 16px 16px;
    }
    
    .message-item.user .message-bubble {
        border-radius: 16px 4px 16px 16px;
    }
    
    .chat-input-area {
        padding: 12px 16px;
    }
    
    .send-btn {
        padding: 10px 22px;
        font-size: 14px;
    }
    
    .welcome-icon {
        width: 80px;
        height: 80px;
    }
    
    .welcome-icon img {
        width: 50px;
        height: 50px;
    }
    
    .welcome-title {
        font-size: 22px;
    }
    
    .welcome-desc {
        font-size: 14px;
    }
}

@media screen and (max-width: 480px) {
    .message-content {
        max-width: 90%;
    }
    
    .message-bubble {
        padding: 10px 14px;
    }
    
    .message-avatar {
        width: 36px;
        height: 36px;
    }
    
    .topic-btn {
        padding: 10px 12px;
        font-size: 13px;
    }
    
    .header-actions {
        gap: 4px;
    }
    
    .header-actions .el-button {
        padding: 4px 12px;
        font-size: 12px;
    }
}
</style>