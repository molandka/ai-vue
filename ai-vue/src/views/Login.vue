<template>
    <div class="login-container">
        <div class="login-card">
            <div class="card-header">
                <div class="back-home" @click="router.push('/')">
                    <el-icon class="back-icon"><ArrowLeft /></el-icon>
                    <span>返回首页</span>
                </div>
            </div>
            <div class="card-body">
                <div class="title-section">
                    <h2 class="login-title">欢迎回来</h2>
                    <p class="login-desc">请登录您的账户</p>
                </div>
                <el-form
                    ref="ruleFormRef"
                    :model="formData"
                    :rules="rules"
                    label-position="top"
                    class="login-form"
                >
                    <el-form-item label="用户名或邮箱" prop="username">
                        <el-input 
                            size="large" 
                            v-model="formData.username" 
                            placeholder="请输入用户名或邮箱"
                            class="form-input"
                        >
                            <template #prefix>
                                <el-icon><User /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input 
                            size="large" 
                            v-model="formData.password" 
                            placeholder="请输入密码" 
                            type="password" 
                            show-password
                            class="form-input"
                        >
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="rememberMe" />
                            <span>记住我</span>
                        </label>
                        <span class="forgot-link">忘记密码?</span>
                    </div>
                    <el-button 
                        class="btn-login" 
                        type="primary" 
                        size="large" 
                        @click="submitform(ruleFormRef)"
                        :loading="isLoading"
                    >
                        {{ isLoading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form>
                <div class="card-footer">
                    <p>还没有账户? <span class="register-link" @click="router.push('/auth/register')">立即注册</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '../api/admin'
import router from '../router'
import { ArrowLeft, User, Lock } from '@element-plus/icons-vue'

const ruleFormRef = ref()
const isLoading = ref(false)
const rememberMe = ref(false)

const submitform = async (formEl) => {
    if (!formEl) return
    isLoading.value = true
    await formEl.validate((valid, fields) => {
        if (valid) {
            login(formData).then(data => {
                if (!data.token) {
                    isLoading.value = false
                    return console.log(data.msg || '登录失败')
                }
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                if (data.userInfo.userType === 2) {
                    router.push('/back/dashboard')
                } else {
                    router.push('/')
                }
            }).catch(() => {
                isLoading.value = false
            })
        } else {
            isLoading.value = false
        }
    })
}

const formData = reactive({
    username: '',
    password: ''
})
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
</script>

<style>
.login-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}

.login-card {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.card-header {
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
}

.back-home {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s;
}

.back-home:hover {
    color: #667eea;
}

.back-icon {
    font-size: 16px;
}

.card-body {
    padding: 40px 30px;
}

.title-section {
    text-align: center;
    margin-bottom: 35px;
}

.login-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 10px 0;
}

.login-desc {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

.login-form {
    width: 100%;
}

.form-input {
    border-radius: 12px;
    border-color: #e2e8f0;
    transition: all 0.2s;
}

.form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #667eea;
}

.forgot-link {
    font-size: 14px;
    color: #667eea;
    cursor: pointer;
    transition: color 0.2s;
}

.forgot-link:hover {
    color: #764ba2;
}

.btn-login {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.2s;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.card-footer {
    text-align: center;
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid #f1f5f9;
}

.card-footer p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.register-link {
    color: #667eea;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
}

.register-link:hover {
    color: #764ba2;
}

@media screen and (max-width: 768px) {
    .login-container {
        padding: 16px;
    }

    .login-card {
        max-width: 100%;
        border-radius: 16px;
    }

    .card-body {
        padding: 24px 20px;
    }

    .login-title {
        font-size: 22px;
    }

    .login-desc {
        font-size: 13px;
    }

    .form-options {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .btn-login {
        height: 44px;
        font-size: 15px;
    }

    .card-footer {
        margin-top: 20px;
        padding-top: 20px;
    }
}
</style>