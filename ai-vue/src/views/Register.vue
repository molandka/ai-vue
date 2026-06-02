<template>
    <div class="register-container">
        <div class="register-card">
            <div class="card-header">
                <div class="back-home" @click="router.push('/auth/login')">
                    <el-icon class="back-icon"><ArrowLeft /></el-icon>
                    <span @click="router.push('/auth/login')">返回登录</span>
                </div>
            </div>
            <div class="card-body">
                <div class="title-section">
                    <h2 class="register-title">创建账户</h2>
                    <p class="register-desc">请填写以下信息注册您的账户</p>
                </div>
                <el-form 
                    :model="formData" 
                    :rules="rules" 
                    ref="submitFormRef" 
                    label-width="120px" 
                    label-position="top"
                    class="register-form"
                >
                    <div class="form-row">
                        <el-form-item label="用户名" prop="username">
                            <el-input 
                                v-model="formData.username" 
                                placeholder="请输入用户名"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><User /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickname">
                            <el-input 
                                v-model="formData.nickname" 
                                placeholder="请输入昵称"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><UserFilled /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-row">
                        <el-form-item label="邮箱" prop="email">
                            <el-input 
                                v-model="formData.email" 
                                placeholder="请输入邮箱"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><Message /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input 
                                v-model="formData.phone" 
                                placeholder="请输入手机号"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><Phone /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-row">
                        <el-form-item label="密码" prop="password">
                            <el-input 
                                type="password" 
                                show-password 
                                v-model="formData.password" 
                                placeholder="请输入密码"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><Lock /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input 
                                type="password" 
                                show-password 
                                v-model="formData.confirmPassword" 
                                placeholder="请确认密码"
                                class="form-input"
                            >
                                <template #prefix>
                                    <el-icon><Lock /></el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="form-row">
                        <el-form-item>
                            <el-select 
                                v-model="formData.gender" 
                                placeholder="请选择性别"
                                class="form-input"
                            >
                                <el-option label="男" :value="1" />
                                <el-option label="女" :value="2" />
                                <el-option label="其他" :value="0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select 
                                v-model="formData.userType" 
                                placeholder="请选择用户类型"
                                class="form-input"
                            >
                                <el-option label="普通用户" :value="1" />
                                <el-option label="管理员" :value="2" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-button 
                        class="btn-register" 
                        type="primary" 
                        size="large"
                        @click="submitForm(submitFormRef)"
                        :loading="isLoading"
                    >
                        {{ isLoading ? '注册中...' : '立即注册' }}
                    </el-button>
                </el-form>
                <div class="card-footer">
                    <p>已有账户? <span class="login-link" @click="router.push('/auth/login')">立即登录</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { register } from '../api/admin'
import router from '../router'


const submitFormRef = ref(null)
const isLoading = ref(false)

const submitForm = async(formEl) => {
    if(!formEl) return
    isLoading.value = true
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                const data = await register(formData)
                if (!data || data.code !== 'BUSINESS_ERROR') {
                    ElMessage.success('注册成功')
                    router.push({ path: '/auth/login' })
                } else {
                    ElMessage.error(data.msg || '注册失败')
                }
            } catch (error) {
                ElMessage.error('注册失败')
            } finally {
                isLoading.value = false
            }
        } else {
            isLoading.value = false
        }
    })
}

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== formData.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }, trigger: 'blur' }
    ],
})

const formData = reactive({
    "username": "",
    "email": "",
    "nickname": "",
    "phone": "",
    "password": "",
    "confirmPassword": "",
    "gender": 0,
    "userType": 1
})
</script>

<style>
.register-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}

.register-card {
    width: 100%;
    max-width: 600px;
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

.register-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 10px 0;
}

.register-desc {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

.register-form {
    width: 100%;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-row .el-form-item {
    flex: 1;
    margin-bottom: 0;
}

.form-input {
    border-radius: 10px;
    border-color: #e2e8f0;
    transition: all 0.2s;
}

.form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-register {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.2s;
    margin-top: 10px;
}

.btn-register:hover:not(:disabled) {
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

.login-link {
    color: #667eea;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
}

.login-link:hover {
    color: #764ba2;
}

@media screen and (max-width: 768px) {
    .register-container {
        padding: 16px;
    }

    .register-card {
        max-width: 100%;
        border-radius: 16px;
    }

    .card-body {
        padding: 24px 16px;
    }

    .title-section {
        margin-bottom: 24px;
    }

    .register-title {
        font-size: 22px;
    }

    .register-desc {
        font-size: 13px;
    }

    .form-row {
        flex-direction: column;
        gap: 0;
        margin-bottom: 0;
    }

    .form-row .el-form-item {
        margin-bottom: 16px;
    }

    .btn-register {
        height: 44px;
        font-size: 15px;
        margin-top: 8px;
    }

    .card-footer {
        margin-top: 20px;
        padding-top: 20px;
    }
}
</style>