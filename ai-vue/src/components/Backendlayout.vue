<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar :is-mobile-open="isMobileMenuOpen" @close="closeMobileMenu" />
      <el-container class="content-container">
        <div class="content-wrapper">
          <div class="header-section">
            <el-header class="header">
              <Navbar @toggle-sidebar="toggleMobileMenu" />
            </el-header>
          </div>
          <div class="main-section">
            <el-main class="main-content">
              <router-view></router-view>
            </el-main>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.backend-layout {
  min-height: 100vh;
  min-width: 100vw;
  margin: 0;
  display: flex;
  background: #f1f5f9;
}

.main-container {
  min-height: 100vh;
  min-width: 100vw;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f1f5f9;
}

.header-section {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.header {
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.main-section {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.main-content {
  padding: 0;
  min-height: calc(100vh - 112px);
}

.sidebar-overlay {
  display: none;
}

@media screen and (max-width: 768px) {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .sidebar-overlay.is-visible {
    display: block;
  }

  .main-section {
    padding: 80px 12px 20px;
  }

  .main-content {
    min-height: calc(100vh - 140px);
  }
}
</style>