<template>
  <div>
    <el-table
    :data="tableData" style="width: 100%"
    >
      <el-table-column label="会话id" width="180">
        <template #default="scope">
          <el-avatar>
            <template #default="scope">
              {{ "scope.row.userNickname" }}
            </template>
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志" >
        <template #default="scope">
          <div class="session-title">{{scope.row.sessionTitle}}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="200" />
      <el-table-column prop="lastMessageTime" label="时间" width="200" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.size"
        @change="handleChange"
        style="margin-top: 25px;"
        :pager-count="3"
      />
      <el-dialog
        v-model="showDetailDialog"
        title="咨询详情"
        width="70%"
        :close-on-click-modal="false"
      >
        <div class="session-detai">
          <div class="detail-header">
            <div class="detail-row">
              <div class="detail-label">用户:</div>
              <div class="detail-value">{{ sessionDetail.userNickname }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">开始事件:</div>
              <div class="detail-value">{{ sessionDetail.startedAt }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">消息数:</div>
              <div class="detail-value">{{ sessionDetail.messageCount }}</div>
            </div>            
          </div>
          <div class="message-container">
            <div class="message-header">
              <h4>对话记录</h4>
            </div>
            <div class="message-list" v-loading="loadingMessage">
              <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.senderType === 1 ? 'user-message' : 'ai-message'">
                <div class="message-header">
                  <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                  <span class="time">{{ message.createdAt }}</span>
                </div>
                <div class="message-content">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button type="primary" @click="showDetailDialog = false">关闭</el-button>
        </template>
      </el-dialog>
  </div>
</template>
<script setup>
import {onMounted, ref, reactive} from 'vue'
import {getConsultationPage, getSessionDetail} from '../api/admin'

const loadingMessage = ref(false)
const tableData = ref([])
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

//详情会话
const showDetailDialog = ref(false)

const sessionDetail = ref({})

const sessionMessages = ref([])
//详情按钮
const viewSessionDetail = (row) => {
  loadingMessage.value = true
  getSessionDetail(row.id).then(res => {
    showDetailDialog.value = true
    sessionMessages.value = res
    sessionDetail.value = row
    loadingMessage.value = false
  })
}
//分页
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}

const handleSearch = () => {
  getConsultationPage(pagination).then(res => {
      const{records,total} = res
      tableData.value = records
      pagination.total = total
  })
}

onMounted(() => {
  handleSearch()


})
</script>

<style >
.session-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.session-detai {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-header {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 500;
  color: #475569;
  min-width: 80px;
}

.detail-value {
  color: #334155;
}

.message-header h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #475569;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.message-item {
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
}

.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
}

.ai-message {
  background: white;
  border: 1px solid #e2e8f0;
  margin-right: auto;
}

.message-item .message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.user-message .message-header {
  color: rgba(255, 255, 255, 0.8);
}

.ai-message .message-header {
  color: #64748b;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

@media screen and (max-width: 768px) {
  .session-preview {
    max-width: 150px;
    font-size: 12px;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .el-dialog {
    width: 95% !important;
    margin: 5vh auto !important;
  }

  .session-detai {
    max-height: 70vh;
  }

  .message-list {
    max-height: 300px;
  }

  .message-item {
    max-width: 90%;
    padding: 10px 12px;
  }

  .message-content {
    font-size: 13px;
  }
}
</style>