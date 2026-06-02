<template>
    <div class="sidebar" :class="{ 'is-open': isMobileOpen }">
        <el-aside :width="sidebarWidth" class="sidebar-aside">
            <el-menu
                :default-active="currentPath"
                class="sidebar-menu"
                :collapse="isCollapse"
                background-color="#ffffff"
                text-color="#374151"
                active-text-color="#667eea"
                unique-opened
            >
                <div class="brand-section">
                    <div class="brand-logo-wrapper">
                        <img :src="iconurl" alt="logo" class="brand-logo" />
                    </div>
                    <div v-show="!isCollapse && !isMobileOpen" class="brand-info">
                        <h1 class="brand-title">心理健康AI助手</h1>
                        <p class="brand-subtitle">管理后台</p>
                    </div>
                </div>
                <div class="menu-divider"></div>
                <el-menu-item
                    v-for="item in menuItems"
                    :key="item.path"
                    :index="item.path"
                    @click="handleMenuClick(item.path)"
                    class="menu-item"
                >
                    <template #title>
                        <el-icon :size="20"><component :is="item.icon" /></el-icon>
                        <span>{{ item.title }}</span>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAdminStore from '../stores/admin'

const props = defineProps({
    isMobileOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

const adminStore = useAdminStore()

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)

const sidebarWidth = computed(() => {
    if (props.isMobileOpen) {
        return '260px'
    }
    return isCollapse.value ? '64px' : '260px'
})

const iconComponents = {
    PieChart: 'PieChart',
    ChatLineSquare: 'User',
    Message: 'MessageSquare',
}

const menuItems = computed(() => {
    return router.options.routes[0]?.children?.map(item => ({
        path: item.path,
        title: item.meta?.title || item.path,
        icon: item.meta?.icon
    })) || []
})

const currentPath = computed(() => {
    return route.path.replace('/back/', '')
})

const handleMenuClick = (path) => {
    router.push(`/back/${path}`)
    if (props.isMobileOpen) {
        emit('close')
    }
}

const iconurl = new URL('../assets/logo.png', import.meta.url).href
</script>

<style scoped>
.sidebar {
    height: 100%;
    background: #ffffff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
}

.sidebar-aside {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.2s ease;
}

.sidebar-menu {
    flex: 1;
    border-right: none;
}

.brand-section {
    display: flex;
    align-items: center;
    padding: 20px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.brand-logo-wrapper {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
}

.brand-info {
    margin-left: 12px;
    overflow: hidden;
}

.brand-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
    white-space: nowrap;
}

.brand-subtitle {
    font-size: 12px;
    opacity: 0.8;
    margin: 0;
    white-space: nowrap;
}

.menu-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 8px 0;
}

.menu-item {
    margin: 4px 8px;
    border-radius: 8px;
    transition: all 0.2s;
}

.menu-item:hover {
    background: #f8fafc;
}

.menu-item.is-active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

:deep(.el-menu-item.is-active::before) {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0 4px 4px 0;
}

:deep(.el-menu-item) {
    position: relative;
    height: 44px;
    line-height: 44px;
}

:deep(.el-menu-item__icon) {
    margin-right: 12px;
}

@media screen and (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        z-index: 1001;
        transition: left 0.3s ease;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
    }

    .sidebar:not(.is-open) {
        left: -260px;
    }

    .sidebar-aside {
        width: 260px !important;
    }
}
</style>