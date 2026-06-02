<template>
    <div class="navbar">
        <div class="navbar-left">
            <el-button
                class="collapse-btn"
                @click="handleToggleSidebar"
                type="text"
            >
                <el-icon :size="20"><component :is="'Fold'" /></el-icon>
            </el-button>
            <div class="page-title-wrapper">
                <h2 class="page-title">{{ title }}</h2>
                <p class="page-breadcrumb">{{ breadcrumb }}</p>
            </div>
        </div>
        <div class="navbar-right">
            <div class="user-menu">
                <el-dropdown @command="handleCommand">
                    <div class="user-info">
                        <el-avatar
                            class="user-avatar"
                            :src="avatarUrl"
                            :icon="'User'"
                        />
                        <div class="user-detail">
                            <p class="user-name">{{ userName }}</p>
                            <p class="user-role">{{ userRole }}</p>
                        </div>
                        <el-icon class="dropdown-icon"><component :is="'ChevronDown'" /></el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout">
                                <el-icon><component :is="'LogOut'" /></el-icon>
                                <span>退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logout } from '../api/admin'
import router from '../router'
import useAdminStore from '../stores/admin'

const adminStore = useAdminStore()

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()

const title = computed(() => route.meta.title || '管理后台')

const breadcrumb = computed(() => {
    return `首页 / ${route.meta.title || '当前页面'}`
})

const userName = computed(() => {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo).nickname || '管理员' : '管理员'
})

const userRole = computed(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        return JSON.parse(userInfo).userType === 2 ? '管理员' : '普通用户'
    }
    return '管理员'
})

const avatarUrl = new URL('../assets/logo.png', import.meta.url).href

const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
        emit('toggle-sidebar')
    } else {
        adminStore.toggleCollapse()
    }
}

const handleCommand = async (command) => {
    if (command === 'logout') {
        try {
            await ElMessageBox.confirm(
                '确定退出登录吗？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    confirmButtonClass: 'btn-danger'
                }
            )
            await logout()
            ElMessage.success('退出登录成功')
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            router.push({ path: '/auth/login' })
        } catch {
            ElMessage.info('已取消退出登录')
        }
    }
}
</script>

<style scoped>
.navbar {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.navbar-left {
    display: flex;
    align-items: center;
    height: 100%;
}

.collapse-btn {
    padding: 8px;
    color: #64748b;
    border-radius: 8px;
    transition: all 0.2s;
}

.collapse-btn:hover {
    background: #f1f5f9;
    color: #667eea;
}

.page-title-wrapper {
    display: flex;
    height: 100%;
    flex-direction: column;
}

.page-title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    height: 70%;
}

.page-breadcrumb {
    font-size: 12px;
    height: 30%;
    color: #94a3b8;
    justify-content: center;
    align-items: center;

}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.user-menu {
    position: relative;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.user-info:hover {
    background: #f8fafc;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border: 2px solid #e2e8f0;
}

.user-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.user-name {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
}

.user-role {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
}

.dropdown-icon {
    font-size: 14px;
    color: #94a3b8;
}

:deep(.el-dropdown-menu) {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: none;
    padding: 8px 0;
}

:deep(.el-dropdown-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-size: 14px;
    color: #475569;
    transition: all 0.2s;
}

:deep(.el-dropdown-item:hover) {
    background: #f1f5f9;
    color: #667eea;
}

:deep(.btn-danger) {
    background: #ef4444;
    border-color: #ef4444;
}

@media screen and (max-width: 768px) {
    .navbar {
        padding: 0 12px;
    }

    .collapse-btn {
        padding: 8px;
    }

    .page-title {
        font-size: 16px;
    }

    .page-breadcrumb {
        display: none;
    }

    .user-detail {
        display: none;
    }

    .user-info {
        padding: 8px;
    }
}
</style>