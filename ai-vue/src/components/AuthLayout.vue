<template>
    <div class="auth-layout">
        <div class="left-section">
            <div class="bg-decoration">
                <div class="floating-circle circle-1"></div>
                <div class="floating-circle circle-2"></div>
                <div class="floating-circle circle-3"></div>
            </div>
            <div class="content">
                <div class="logo-wrapper">
                    <div class="logo-ring"></div>
                    <img :src="iconurl" alt="心理AI助手" class="logo-image" />
                </div>
                <h2 class="title">心理AI助手</h2>
                <p class="text">每个深夜，每个焦虑时刻，我们都在这里，不必独自承受，让心与心的连接温暖每一天</p>
                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon-wrapper">
                            <span class="feature-icon">💚</span>
                        </div>
                        <span class="feature-text">专业心理支持</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon-wrapper">
                            <span class="feature-icon">🔒</span>
                        </div>
                        <span class="feature-text">隐私安全保护</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon-wrapper">
                            <span class="feature-icon">⏰</span>
                        </div>
                        <span class="feature-text">24小时在线</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-section">
            <div class="mobile-header">
                <img :src="iconurl" alt="心理AI助手" class="mobile-logo" />
                <h3 class="mobile-title">心理AI助手</h3>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
   const iconurl = new URL('../assets/logo.png', import.meta.url).href
</script>

<style scoped>
.auth-layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.left-section {
    width: 55%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 80%, #f5576c 100%);
    position: relative;
    overflow: hidden;
}

.bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.floating-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.3;
}

.circle-1 {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.2);
    top: -100px;
    right: -50px;
    animation: float1 8s ease-in-out infinite;
}

.circle-2 {
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.15);
    bottom: -50px;
    left: -30px;
    animation: float2 10s ease-in-out infinite;
}

.circle-3 {
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    top: 50%;
    left: -75px;
    animation: float3 6s ease-in-out infinite;
}

@keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-30px, 30px) scale(1.1); }
}

@keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(0.9); }
}

@keyframes float3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(50px, 20px); }
}

.left-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.content {
    z-index: 1;
    padding: 60px;
    color: white;
    text-align: center;
}

.logo-wrapper {
    position: relative;
    width: 130px;
    height: 130px;
    margin: 0 auto 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
    animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.05); opacity: 0.8; }
}

.logo-image {
    position: relative;
    z-index: 2;
    width: 85px;
    height: 85px;
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.title {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    letter-spacing: -1px;
}

.text {
    font-size: 17px;
    line-height: 2;
    opacity: 0.95;
    margin-bottom: 50px;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.features {
    display: flex;
    justify-content: center;
    gap: 50px;
}

.feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    transition: transform 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-5px);
}

.feature-icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.feature-icon {
    font-size: 26px;
}

.feature-text {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.95;
}

.right-section {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 40px;
    box-sizing: border-box;
}

.mobile-header {
    display: none;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
}

.mobile-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

@media screen and (max-width: 992px) {
    .left-section {
        width: 50%;
    }
    
    .right-section {
        width: 50%;
    }
    
    .title {
        font-size: 32px;
    }
    
    .text {
        font-size: 15px;
        max-width: 350px;
    }
    
    .features {
        gap: 35px;
    }
    
    .feature-icon-wrapper {
        width: 50px;
        height: 50px;
    }
}

@media screen and (max-width: 768px) {
    .auth-layout {
        flex-direction: column;
        height: auto;
        min-height: 100vh;
    }
    
    .left-section {
        width: 100%;
        padding: 40px 20px;
        box-sizing: border-box;
        min-height: 300px;
    }
    
    .right-section {
        width: 100%;
        padding: 30px 20px;
        min-height: calc(100vh - 300px);
    }
    
    .content {
        padding: 20px;
    }
    
    .logo-wrapper {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
    }
    
    .logo-image {
        width: 65px;
        height: 65px;
    }
    
    .title {
        font-size: 28px;
        margin-bottom: 16px;
    }
    
    .text {
        font-size: 14px;
        line-height: 1.8;
        margin-bottom: 30px;
        max-width: 100%;
    }
    
    .features {
        gap: 30px;
    }
    
    .feature-icon-wrapper {
        width: 45px;
        height: 45px;
    }
    
    .feature-icon {
        font-size: 22px;
    }
    
    .feature-text {
        font-size: 13px;
    }
    
    .floating-circle {
        transform: scale(0.7);
    }
    
    .circle-1 {
        top: -80px;
        right: -40px;
    }
    
    .circle-2 {
        bottom: -40px;
        left: -25px;
    }
    
    .circle-3 {
        top: 40%;
        left: -50px;
    }
}

@media screen and (max-width: 480px) {
    .left-section {
        padding: 30px 15px;
        min-height: 280px;
    }
    
    .right-section {
        padding: 25px 15px;
        min-height: calc(100vh - 280px);
    }
    
    .logo-wrapper {
        width: 85px;
        height: 85px;
        margin-bottom: 16px;
    }
    
    .logo-image {
        width: 55px;
        height: 55px;
    }
    
    .title {
        font-size: 24px;
        margin-bottom: 12px;
    }
    
    .text {
        font-size: 13px;
        margin-bottom: 24px;
        padding: 0 10px;
    }
    
    .features {
        gap: 20px;
    }
    
    .feature-icon-wrapper {
        width: 40px;
        height: 40px;
    }
    
    .feature-icon {
        font-size: 20px;
    }
    
    .feature-text {
        font-size: 12px;
    }
}

@media screen and (max-width: 360px) {
    .features {
        gap: 15px;
    }
    
    .feature-icon-wrapper {
        width: 36px;
        height: 36px;
    }
    
    .feature-icon {
        font-size: 18px;
    }
    
    .feature-text {
        font-size: 11px;
    }
    
    .text {
        font-size: 12px;
    }
}
</style>