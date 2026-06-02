<template>
  <div class="knowledge-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <el-icon class="header-icon"><Document /></el-icon>
          知识文章
        </h1>
        <p class="page-desc">管理和维护知识文章内容</p>
      </div>
      <div class="header-right">
        <el-button
          @click="handleEdit({})"
          type="primary"
          class="btn-primary"
        >
          <el-icon><component :is="'Plus'" /></el-icon>
          新增文章
        </el-button>
      </div>
    </div>

    <div class="content-card">
      <div class="search-section">
        <TableSearch :formItem="formItem" @search="handleSearch" />
      </div>

      <div class="table-section">
        <el-table
          :data="tableData"
          class="main-table"
          :header-cell-class-name="'table-header'"
          stripe
        >
          <el-table-column
            fixed="left"
            prop="title"
            label="文章标题"
            min-width="180"
          >
            <template #default="scope">
              <div class="title-cell">
                <el-icon class="title-icon"><Document /></el-icon>
                <span class="title-text">{{ scope.row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="categoryId" label="文章分类" min-width="140">
            <template #default="scope">
              <span class="category-tag">{{ categoryMap[scope.row.categoryId] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="authorName" width="120" label="作者" />
          <el-table-column prop="readCount" width="120" label="阅读量">
            <template #default="scope">
              <span class="read-count">
                <el-icon><component :is="'Eye'" /></el-icon>
                {{ scope.row.readCount }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" width="160" label="更新时间" />
          <el-table-column label="状态" width="100" fixed="right">
            <template #default="scope">
              <span :class="['status-badge', `status-${scope.row.status}`]">
                {{ statusMap[scope.row.status] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="scope">
              <div class="action-buttons">
                <el-button
                  @click="handleEdit(scope.row)"
                  class="btn-action btn-edit"
                  text
                >
                  <el-icon><component :is="'Edit'" /></el-icon>
                  <span class="btn-text">编辑</span>
                </el-button>
                <el-button
                  @click="handlePublish(scope.row)"
                  v-if="scope.row.status === 0 || scope.row.status === 2"
                  class="btn-action btn-publish"
                  text
                >
                  <el-icon><component :is="'Upload'" /></el-icon>
                  <span class="btn-text">发布</span>
                </el-button>
                <el-button
                  @click="handleUnpublish(scope.row)"
                  v-if="scope.row.status === 1"
                  class="btn-action btn-unpublish"
                  text
                >
                  <el-icon><component :is="'Download'" /></el-icon>
                  <span class="btn-text">下线</span>
                </el-button>
                <el-button
                  @click="handleDelete(scope.row)"
                  class="btn-action btn-delete"
                  text
                >
                  <el-icon><component :is="'Delete'" /></el-icon>
                  <span class="btn-text">删除</span>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          layout="prev, pager, next"
          :total="pagination.total"
          :page-size="pagination.size"
          @change="handleChange"
          :pager-count="3"
          class="pagination"
        />
      </div>
    </div>

    <ArticleDialog
      v-model:modelValue="dialogVisivle"
      :article="currentArticle"
      :categories="categories"
      @success="handleSuccess"
    />
  </div>
</template>

<style scoped>
.knowledge-container {
  width: 100%;
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  background-attachment: fixed;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  flex-direction: column;
}

.header-icon {
  color: #667eea;
  margin-right: 10px;
  font-size: 24px;
}

.page-title {
  margin: 0 0 6px 0;
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  letter-spacing: -0.5px;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(102, 126, 234, 0.45);
}

.btn-primary:active {
  transform: translateY(0);
}

.content-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.08);
}

.search-section {
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20px;
}

.table-section {
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;
}

.table-section::-webkit-scrollbar {
  height: 8px;
}

.table-section::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.table-section::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.table-section::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.main-table {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-table) {
  --el-table-border-color: #f1f5f9;
  --el-table-header-bg-color: #f8fafc;
}

:deep(.table-header) {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

:deep(.table-header .el-table__cell) {
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  padding: 18px 14px;
  border-bottom: 2px solid #e2e8f0;
}

:deep(.el-table__body .el-table__row) {
  transition: all 0.2s ease;
}

:deep(.el-table__body .el-table__row:hover) {
  background: #f8fafc !important;
  transform: scale(1.002);
}

:deep(.el-table__body .el-table__row:active) {
  transform: scale(0.998);
}

:deep(.el-table__body td) {
  padding: 18px 14px;
}

:deep(.el-table__body tr:last-child td) {
  border-bottom: none;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #667eea;
  font-size: 20px;
}

.title-text {
  font-weight: 600;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.category-tag {
  display: inline-flex;
  padding: 7px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  font-size: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.read-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.read-count .el-icon {
  color: #667eea;
  font-size: 16px;
}

.status-badge {
  display: inline-flex;
  padding: 7px 16px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.status-0 {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.status-1 {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
}

.status-2 {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-action .el-icon {
  font-size: 16px;
}

.btn-edit {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.btn-edit:hover {
  background: rgba(102, 126, 234, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.btn-publish {
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.btn-publish:hover {
  background: rgba(16, 185, 129, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-unpublish {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
}

.btn-unpublish:hover {
  background: rgba(245, 158, 11, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.btn-delete {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-top: 10px;
}

:deep(.pagination) {
  padding: 8px 0;
}

:deep(.el-pagination) {
  font-weight: 500;
}

:deep(.el-pagination__total) {
  color: #64748b;
  font-size: 14px;
}

:deep(.el-pagination button) {
  border-radius: 10px;
  padding: 8px 14px;
}

:deep(.el-pagination .el-pager li) {
  margin: 0 6px;
  width: 38px;
  height: 38px;
  line-height: 38px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-pagination .el-pager li:hover) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

@media screen and (max-width: 1024px) {
  .action-buttons {
    gap: 8px;
  }
  
  .btn-action {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .btn-action .el-icon {
    font-size: 14px;
  }
}

@media screen and (max-width: 992px) {
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }

  .btn-action {
    width: 100%;
    justify-content: center;
    padding: 10px;
  }
}

@media screen and (max-width: 768px) {
  .knowledge-container {
    padding: 12px;
    min-height: calc(100vh - 60px);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px;
    margin-bottom: 16px;
    border-radius: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .header-icon {
    font-size: 22px;
  }

  .btn-primary {
    width: 100%;
    margin-top: 14px;
    justify-content: center;
    padding: 12px 24px;
  }

  .content-card {
    padding: 16px;
    border-radius: 16px;
  }

  .search-section {
    padding-bottom: 14px;
    margin-bottom: 14px;
  }

  .table-section {
    margin: 0 -16px;
    padding: 0 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .main-table {
    min-width: 720px;
  }

  :deep(.table-header .el-table__cell) {
    padding: 14px 10px;
    font-size: 12px;
  }

  :deep(.el-table__body td) {
    padding: 14px 10px;
  }

  .title-cell {
    gap: 8px;
  }

  .title-icon {
    font-size: 16px;
  }

  .title-text {
    max-width: 140px;
    font-size: 13px;
  }

  .category-tag {
    font-size: 11px;
    padding: 5px 12px;
  }

  .read-count {
    font-size: 12px;
  }

  .status-badge {
    font-size: 11px;
    padding: 5px 12px;
  }

  .btn-action {
    padding: 8px 12px;
    font-size: 12px;
  }

  .btn-action .el-icon {
    font-size: 14px;
  }

  .pagination-wrapper {
    padding: 16px 0;
  }

  :deep(.el-pagination .el-pager li) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    margin: 0 3px;
  }
}

@media screen and (max-width: 480px) {
  .knowledge-container {
    padding: 8px;
  }

  .page-header {
    padding: 14px;
    border-radius: 14px;
  }

  .header-left {
    width: 100%;
  }

  .page-title {
    font-size: 18px;
  }

  .page-desc {
    font-size: 12px;
  }

  .btn-primary {
    padding: 11px 20px;
    font-size: 14px;
    margin-top: 12px;
  }

  .content-card {
    padding: 12px;
    border-radius: 14px;
  }

  .search-section {
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .table-section {
    margin: 0 -12px;
    padding: 0 12px;
  }

  .main-table {
    min-width: 650px;
  }

  :deep(.table-header .el-table__cell) {
    padding: 12px 8px;
    font-size: 11px;
  }

  :deep(.el-table__body td) {
    padding: 12px 8px;
  }

  .title-text {
    max-width: 100px;
    font-size: 12px;
  }

  .category-tag {
    font-size: 10px;
    padding: 4px 10px;
  }

  .status-badge {
    font-size: 10px;
    padding: 4px 10px;
  }

  .btn-text {
    display: none;
  }

  .btn-action {
    padding: 10px;
    justify-content: center;
  }

  .btn-action .el-icon {
    font-size: 16px;
  }

  :deep(.el-pagination .el-pager li) {
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  :deep(.el-pagination button) {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media screen and (max-width: 360px) {
  .knowledge-container {
    padding: 6px;
  }

  .page-header {
    padding: 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .content-card {
    padding: 10px;
    border-radius: 12px;
  }

  .table-section {
    margin: 0 -10px;
    padding: 0 10px;
  }

  .title-text {
    max-width: 80px;
  }

  :deep(.el-table__body td) {
    padding: 10px 6px;
  }

  :deep(.table-header .el-table__cell) {
    padding: 10px 6px;
    font-size: 10px;
  }
}
</style>

<script setup>
import TableSearch from '../components/TableSearch.vue'
import { categoryTree, articlepage, getArticleDetail, changeArticleStatus, deleteArticle } from '../api/admin'
import { onMounted, ref, reactive } from 'vue'

import ArticleDialog from '../components/ArticleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const statusMap = {
  0: '草稿',
  1: '已发布',
  2: '已下线'
}

const handlePublish = (row) => {
  ElMessageBox.confirm(
    `确认发布文章「${row.title}」吗？`,
    '确认发布',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    changeArticleStatus(row.id, { status: 1 }).then(res => {
      ElMessage.success('发布成功')
      handleSearch()
    })
  })
}

const handleUnpublish = (row) => {
  ElMessageBox.confirm(
    `确认下线文章「${row.title}」吗？`,
    '确认下线',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    changeArticleStatus(row.id, { status: 2 }).then(res => {
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除文章「${row.title}」吗？此操作不可恢复！`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}

const currentArticle = ref(null)

const handleEdit = (row) => {
  if (!row.id) {
    currentArticle.value = null
    dialogVisivle.value = true
  } else {
    getArticleDetail(row.id).then(res => {
      currentArticle.value = res
      dialogVisivle.value = true
    })
  }
}

const handleSuccess = () => {
  dialogVisivle.value = false
  handleSearch()
}

const handleChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}

const tableData = ref([])
const categories = ref([])
const categoryMap = reactive({})

onMounted(async () => {
  const data = await categoryTree()
  categories.value = data.map(item => {
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id
    }
  })
  formItem[1].options = categories.value
  handleSearch()
})

const formItem = [{
  comp: 'input',
  prop: 'title',
  label: '文章标题',
  placeholder: '请输入文章标题'
},
{
  comp: 'select',
  prop: 'categoryId',
  label: '文章分类',
  placeholder: '请选择文章分类'
},
{
  comp: 'select',
  prop: 'status',
  label: '状态',
  placeholder: '请选择状态',
  options: [
    { label: '草稿', value: 0 },
    { label: '已发布', value: 1 },
    { label: '已下线', value: 2 }
  ]
}
]

const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 1
})

const handleSearch = async (formData) => {
  const params = {
    ...pagination,
    ...formData
  }
  const { records, total } = await articlepage(params)
  tableData.value = records
  pagination.total = total
}

const dialogVisivle = ref(false)
console.log(pagination.total)
</script>