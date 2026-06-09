<template>
    <div class="front-layout">
        <header class="front-header">
            <div class="header-container">
                <div class="header-left">
                    <img :src="imgUrl" alt="logo" class="header-logo">
                    <h1 class="header-title">心理健康助手</h1>
                </div>
                <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'is-active': isMobileMenuOpen }">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav class="nav-section" :class="{ 'is-open': isMobileMenuOpen }">
                    <router-link to="/" class="nav-link" @click="closeMobileMenu">首页</router-link>
                    <router-link v-if="login" to="/frontendconsultation" class="nav-link" @click="closeMobileMenu">AI咨询</router-link>
                    <!-- <router-link v-if="login" to="/emotion-diary" class="nav-link" @click="closeMobileMenu">情绪日记</router-link> -->
                    <router-link to="/frontendknowledge" class="nav-link" @click="closeMobileMenu">知识库</router-link>
                    <router-link v-if="!login" to="/auth/login" class="nav-link" @click="closeMobileMenu">登录</router-link>
                    <router-link v-if="!login" to="/auth/register" class="nav-link" @click="closeMobileMenu">
                        注册
                    </router-link>
                    <p v-if="login" type="text" class="nav-link" @click="handleLogout(token)">退出登录</p>
                </nav>
            </div>
        </header>
        <main class="front-content">
            <router-view></router-view>
        </main>
        <footer class="front-footer">
            <p>© 2024 心理健康助手 - 让AI守护您的心理健康</p>
        </footer>
    </div>
</template>

<script setup>
import router from '../router'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { logout } from '../api/admin'

const token = localStorage.getItem('token')
const login = ref(false)
const isMobileMenuOpen = ref(false)

const handleLogout = (token) => {
    logout(token).then(() => {
        ElMessage.success('退出登录成功')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push({ path: '/auth/login' })
    })
    closeMobileMenu()
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}

onMounted(() => {
    login.value = localStorage.getItem('token') !== null
})

const imgUrl = new URL('../assets/logo.png', import.meta.url).href
</script>

<style scoped>
.front-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.front-header {
    background: linear-gradient(135deg, rgb(37, 136, 119) 0%, rgb(52, 152, 128) 100%);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-logo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-section {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    padding: 8px 16px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.nav-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.15);
}

.nav-link-btn {
    padding: 0;
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
    display: block;
    width: 100%;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.mobile-menu-btn.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.is-active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

.front-content {
    flex: 1;
    background-color: white;
}

.front-footer {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: rgba(255, 255, 255, 0.8);
    padding: 24px;
    text-align: center;
}

.front-footer p {
    margin: 0;
    font-size: 14px;
}

@media screen and (max-width: 992px) {
    .header-title {
        font-size: 20px;
    }

    .nav-link {
        padding: 6px 12px;
        font-size: 14px;
    }
}

@media screen and (max-width: 768px) {
    .header-container {
        padding: 0 16px;
        height: 60px;
    }

    .header-title {
        font-size: 18px;
    }

    .header-logo {
        width: 38px;
        height: 38px;
    }

    .mobile-menu-btn {
        display: flex;
        z-index: 101;
    }

    .nav-section {
        position: fixed;
        top: 0;
        right: -280px;
        width: 280px;
        height: 100vh;
        background: linear-gradient(180deg, rgb(37, 136, 119) 0%, rgb(52, 152, 128) 100%);
        flex-direction: column;
        align-items: flex-start;
        padding: 80px 24px 24px;
        gap: 8px;
        transition: right 0.3s ease;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
    }

    .nav-section.is-open {
        right: 0;
    }

    .nav-link {
        width: 100%;
        padding: 14px 16px;
        font-size: 16px;
        border-radius: 10px;
    }

    .nav-link-btn {
        width: 100%;
        padding: 0;
    }

    .nav-link-btn .el-button {
        width: 100%;
    }

    .front-footer {
        padding: 16px;
        font-size: 12px;
    }
}

@media screen and (max-width: 480px) {
    .header-title {
        font-size: 16px;
    }

    .header-logo {
        width: 34px;
        height: 34px;
    }
}
</style>