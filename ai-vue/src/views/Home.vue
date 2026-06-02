<template>
    <div class="home-container">
        <div class="home-row">
            <div class="home-content">
                <div class="home-col home-col-text">
                    <div class="home-text">
                        <h2 class="home-title">一次温暖的对话
                            <span class="home-subtitle">化孤独为慰藉</span>
                        </h2>
                        <p class="home-desc">心理健康助手是一个基于AI的心理健康助手,您的好友,您的支持者,您的保护者。</p>
                    </div>
                    <div class="home-button">
                        <el-button class="btn-primary">开始倾诉,获得陪伴</el-button>
                        <el-button class="btn-secondary">记录心情,释放情感</el-button>
                    </div>
                </div>
                <div class="home-col home-col-image">
                    <div class="home-image">
                        <img :src="imgUrl" alt="logo" class="logo-img">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const imgUrl = new URL('../assets/logo.png', import.meta.url).href
</script>

<style scoped>
.home-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    background: linear-gradient(135deg, rgb(37, 136, 119) 0%, rgb(52, 152, 128) 100%);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
}

.home-row {
    width: 100%;
    max-width: 1200px;
    display: flex;
}

.home-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
}

.home-col {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.home-col-text {
    align-items: flex-start;
}

.home-col-image {
    align-items: center;
    justify-content: center;
}

.home-text {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.home-title {
    font-size: 48px;
    font-weight: 700;
    color: white;
    line-height: 1.3;
    margin: 0;
    text-align: left;
}

.home-subtitle {
    display: block;
    font-size: 48px;
    font-weight: 700;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.home-desc {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.8;
    margin: 0;
    text-align: left;
    max-width: 500px;
}

.home-button {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
    height: 50px;
    padding: 0 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 25px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.btn-primary {
    background: white;
    color: rgb(37, 136, 119);
    border: 2px solid white;
}

.btn-primary:hover {
    background: transparent;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.home-image {
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-img {
    height: 200px;
    width: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
}

.logo-img:hover {
    transform: scale(1.05);
}

@media screen and (max-width: 992px) {
    .home-content {
        flex-direction: column;
        gap: 40px;
        text-align: center;
    }

    .home-col-text {
        align-items: center;
    }

    .home-title,
    .home-subtitle {
        font-size: 36px;
        text-align: center;
    }

    .home-desc {
        text-align: center;
        font-size: 18px;
    }

    .home-button {
        justify-content: center;
    }
}

@media screen and (max-width: 768px) {
    .home-container {
        padding: 30px 16px;
    }

    .home-title,
    .home-subtitle {
        font-size: 28px;
    }

    .home-desc {
        font-size: 14px;
    }

    .logo-img {
        height: 150px;
        width: 150px;
    }

    .btn-primary,
    .btn-secondary {
        height: 44px;
        padding: 0 24px;
        font-size: 14px;
    }
}

@media screen and (max-width: 480px) {
    .home-title,
    .home-subtitle {
        font-size: 24px;
    }

    .home-desc {
        font-size: 13px;
    }

    .home-button {
        flex-direction: column;
        width: 100%;
        gap: 12px;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
        height: 48px;
    }
}
</style>