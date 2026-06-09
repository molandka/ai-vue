<template>
    <div class="knowledge-container">
        <div class="knowledge-header">
            <h1 class="page-title">心理健康知识库</h1>
            <p class="page-desc">探索专业的心理健康知识，提升心灵健康水平</p>
        </div>
        
        <div class="knowledge-content">
            <div class="knowledge-sidebar">
                <div class="sidebar-header">
                    <h3>知识列表</h3>
                    <span class="count">{{ knowledgeList.length }} 篇文章</span>
                </div>
                <div class="article-list">
                    <div 
                        v-for="article in knowledgeList" 
                        :key="article.id"
                        class="article-item"
                        :class="{ active: selectedArticle?.id === article.id }"
                        @click="selectArticle(article)"
                    >
                        <div class="article-cover" :style="{ backgroundImage: `url(${article.coverImage})` }">
                            <div class="article-category">{{ article.categoryName }}</div>
                        </div>
                        <div class="article-info">
                            <h4 class="article-title">{{ article.title }}</h4>
                            <p class="article-summary">{{ article.summary }}</p>
                            <div class="article-meta">
                                <span class="author">{{ article.authorName }}</span>
                                <span class="views">阅读 {{ article.readCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="knowledgeList.length === 0" class="empty-state">
                    <div class="empty-icon">📚</div>
                    <p>暂无知识文章</p>
                </div>
            </div>
            
            <div class="knowledge-detail">
                <div v-if="selectedArticle" class="detail-content">
                    <div class="detail-header">
                        <div class="detail-category">{{ selectedArticle.categoryName }}</div>
                        <h2 class="detail-title">{{ selectedArticle.title }}</h2>
                        <div class="detail-meta">
                            <span class="meta-item">
                                <i class="icon-user"></i>
                                {{ selectedArticle.authorName }}
                            </span>
                            <span class="meta-item">
                                <i class="icon-eye"></i>
                                {{ selectedArticle.readCount }} 阅读
                            </span>
                            <span class="meta-item">
                                <i class="icon-heart"></i>
                                {{ selectedArticle.favoriteCount }} 收藏
                            </span>
                            <span class="meta-item">
                                <i class="icon-calendar"></i>
                                {{ formatDate(selectedArticle.publishedAt) }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="detail-tags">
                        <span 
                            v-for="tag in (selectedArticle.tagArray || selectedArticle.tags?.split(','))" 
                            :key="tag"
                            class="tag"
                        >
                            {{ tag }}
                        </span>
                    </div>
                    
                    <div class="detail-cover">
                        <img :src="selectedArticle.coverImage" :alt="selectedArticle.title" />
                    </div>
                    
                    <div class="detail-body" v-html="selectedArticle.content"></div>
                    
                    <div class="detail-actions">
                        <button 
                            class="action-btn favorite-btn"
                            :class="{ favorited: selectedArticle.isFavorited }"
                            @click="toggleFavorite"
                        >
                            <i class="icon-heart"></i>
                            {{ selectedArticle.isFavorited ? '已收藏' : '收藏' }}
                        </button>
                        <button class="action-btn share-btn">
                            <i class="icon-share"></i>
                            分享
                        </button>
                    </div>
                </div>
                
                <div v-else class="detail-placeholder">
                    <div class="placeholder-icon">🔍</div>
                    <h3>选择一篇文章开始阅读</h3>
                    <p>从左侧列表中选择一篇知识文章，查看详细内容</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeList, getKnowledgeDetail } from '../api/admin'

const knowledgeList = ref([])
const selectedArticle = ref(null)

onMounted(async () => {
    await getKnowledgeList({
        sortField: "readCount",
        sortDirection: "desc",
        currentPage: 1,
        size: 10,
    }).then((res) => {
        knowledgeList.value = res.records || []
        if (knowledgeList.value.length > 0) {
            selectArticle(knowledgeList.value[0])
        }
    }).catch((error) => {
        console.error('获取知识列表失败:', error)
    })
})

const selectArticle = async (article) => {
    selectedArticle.value = article
    await getKnowledgeDetail(article.id).then((res) => {
        selectedArticle.value = res
    }).catch((error) => {
        console.error('获取知识详情失败:', error)
    })
}

const toggleFavorite = () => {
    if (selectedArticle.value) {
        selectedArticle.value.isFavorited = !selectedArticle.value.isFavorited
        selectedArticle.value.favoriteCount += selectedArticle.value.isFavorited ? 1 : -1
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<style>
.knowledge-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    padding: 30px;
}

.knowledge-header {
    text-align: center;
    margin-bottom: 30px;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 10px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.page-desc {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
}

.knowledge-content {
    display: flex;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

.knowledge-sidebar {
    width: 380px;
    flex-shrink: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f3f4f6;
}

.sidebar-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
}

.count {
    font-size: 13px;
    color: #9ca3af;
    padding: 4px 12px;
    background: #f3f4f6;
    border-radius: 20px;
}

.article-list {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.article-list::-webkit-scrollbar {
    width: 6px;
}

.article-list::-webkit-scrollbar-track {
    background: #f3f4f6;
}

.article-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

.article-item {
    display: flex;
    gap: 14px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f3f4f6;
}

.article-item:hover {
    background: #f9fafb;
}

.article-item.active {
    background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
    border-left: 3px solid #667eea;
}

.article-cover {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.article-category {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 11px;
    text-align: center;
}

.article-info {
    flex: 1;
    min-width: 0;
}

.article-title {
    margin: 0 0 6px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.article-summary {
    margin: 0 0 8px 0;
    font-size: 12px;
    color: #6b7280;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}

.article-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: #9ca3af;
}

.knowledge-detail {
    flex: 1;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.detail-content {
    padding: 30px;
}

.detail-header {
    margin-bottom: 20px;
}

.detail-category {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 12px;
    border-radius: 20px;
    margin-bottom: 12px;
}

.detail-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 13px;
    color: #6b7280;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-item i {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon-user::before { content: '👤'; }
.icon-eye::before { content: '👁️'; }
.icon-heart::before { content: '❤️'; }
.icon-calendar::before { content: '📅'; }
.icon-share::before { content: '🔗'; }

.detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
}

.tag {
    padding: 6px 14px;
    background: #f3f4f6;
    color: #374151;
    font-size: 13px;
    border-radius: 20px;
}

.detail-cover {
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
}

.detail-cover img {
    width: 100%;
    height: auto;
    display: block;
}

.detail-body {
    color: #374151;
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 30px;
}

.detail-body p {
    margin: 0 0 16px 0;
}

.detail-body img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.detail-actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #f3f4f6;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.favorite-btn {
    background: #fef3c7;
    color: #d97706;
}

.favorite-btn.favorited {
    background: #fee2e2;
    color: #dc2626;
}

.favorite-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.share-btn {
    background: #e0e7ff;
    color: #4f46e5;
}

.share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.empty-state {
    padding: 40px;
    text-align: center;
    color: #9ca3af;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.detail-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    text-align: center;
    color: #9ca3af;
}

.placeholder-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.detail-placeholder h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: #6b7280;
}

.detail-placeholder p {
    margin: 0;
    font-size: 14px;
}

@media screen and (max-width: 1024px) {
    .knowledge-content {
        flex-direction: column;
    }
    
    .knowledge-sidebar {
        width: 100%;
        max-height: 300px;
    }
    
    .article-list {
        max-height: 200px;
    }
    
    .detail-content {
        padding: 20px;
    }
    
    .detail-title {
        font-size: 20px;
    }
}

@media screen and (max-width: 768px) {
    .knowledge-container {
        padding: 15px;
    }
    
    .page-title {
        font-size: 24px;
    }
    
    .page-desc {
        font-size: 14px;
    }
    
    .knowledge-content {
        gap: 20px;
    }
    
    .sidebar-header {
        padding: 15px;
    }
    
    .article-item {
        padding: 12px;
        gap: 12px;
    }
    
    .article-cover {
        width: 65px;
        height: 65px;
    }
    
    .article-title {
        font-size: 13px;
    }
    
    .article-summary {
        font-size: 11px;
    }
    
    .detail-content {
        padding: 16px;
    }
    
    .detail-title {
        font-size: 18px;
    }
    
    .detail-meta {
        gap: 10px;
        font-size: 12px;
    }
    
    .detail-body {
        font-size: 14px;
        line-height: 1.7;
    }
    
    .tag {
        padding: 4px 10px;
        font-size: 12px;
    }
    
    .action-btn {
        padding: 8px 16px;
        font-size: 13px;
    }
}

@media screen and (max-width: 480px) {
    .knowledge-container {
        padding: 10px;
    }
    
    .article-item {
        flex-direction: column;
        gap: 10px;
    }
    
    .article-cover {
        width: 100%;
        height: 120px;
    }
    
    .article-info {
        padding: 0 4px;
    }
    
    .article-title {
        white-space: normal;
        overflow: visible;
        text-overflow: unset;
    }
    
    .article-meta {
        gap: 8px;
    }
    
    .detail-title {
        font-size: 16px;
    }
    
    .detail-meta {
        flex-direction: column;
        gap: 6px;
    }
    
    .detail-actions {
        justify-content: center;
    }
}
</style>