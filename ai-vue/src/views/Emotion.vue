<template>
  <div>
    <TableSearch :formItem="formItem" @search="handleSearch"/>
    <el-table
        :data="tableData"
        style="width: 100%"
    >
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column label="会话ID" width="80">
          <template #default="scope">
            <el-avatar>{{scope.row.nickname}}</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="diaryDate" label="记录日期"  />
        <el-table-column label="情绪评分" width="260">
          <template #default="scope">
            <el-rate v-model="scope.row.moodScore" :max="10" disabled />
          </template>
        </el-table-column>
        <el-table-column label="生活指标" width="100">
          <template #default="scope">
            <div>
              <p>
                睡眠:{{ scope.row.sleepQuality }} / 5
              </p>
              <p>
                压力:{{ scope.row.stressLevel }} / 5
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="emotionTriggers" label="情绪触发因素" />
        <el-table-column prop="diaryCotent" label="日记内容"  />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="viewSessionDetail(scope.row)">详情</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      @change="handleChange"
      style="margin-top: 25px;"
    />
    <el-dialog
      v-model="detailDialogVisible"
      title="情绪日志详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="currentDetail">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions
            :column="2"
            border
          >
            <el-descriptions-item label="用户名">{{currentDetail.username}}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{currentDetail.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户id">{{currentDetail.userId}}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{currentDetail.diaryDate}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions
            :column="2"
            border
          >
            <el-descriptions-item label="情绪评分">
              <el-rate v-model="currentDetail.moodScore" :max="10" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">{{currentDetail.dominantEmotion || '-'}}</el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{currentDetail.sleepQuality}} / 5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{currentDetail.stressLevel}} / 5</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions
            :column="1"
            border
          >
            <el-descriptions-item label="情绪触发因素">{{currentDetail.emotionTriggers || '-'}}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{currentDetail.diaryCotent || '-'}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>Ai情绪分析结果</h4>
          <el-descriptions
            :column="2"
            border
          >
            <el-descriptions-item label="主要情绪">
              <el-tag type="primary">{{aiData.primaryEmotion || '-'}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪强度">
              <el-progress :percentage="aiData.emotionScore" :stroke-width="8" />
            </el-descriptions-item>
            <el-descriptions-item label="风险等级">
              <el-tag type="primary">{{aiData.riskLevel || '-'}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="情绪性质">
              <el-tag type="primary">{{aiData.isNegative ? '负面情绪' : '正面情绪'}}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="ai-suggestion-section">
          <h4 style="width: auto; text-align: left; background-color: #f5f7fa; padding:8px 11px; border:1px solid; border-color: #ebeef5;margin-bottom: 10px">专业建议</h4>
          <div class="suggestion-content">{{ aiData.suggestion || '无' }}</div>
        </div>
        <div class="ai-risk-section">
          <h4 style="width: auto; text-align: left; background-color: #f5f7fa; padding:8px 11px; border:1px solid; border-color: #ebeef5;margin-bottom: 10px;">风险等级</h4>
          <div class="risk-content">{{ aiData.riskDescription || '无' }}</div>
        </div>
        <div class="ai-improvements-section">
          <h4 style="width: auto; text-align: left; background-color: #f5f7fa; padding:8px 11px; border:1px solid; border-color: #ebeef5;margin-bottom: 10px;">改善建议</h4>
          <ul class="improvement-list">
            <li style="text-align: center" v-for="item in aiData.improvementSuggestions" :key="item">{{item}}</li>
          </ul>
        </div>
        <div class="detail-section>">
          <h4>时间信息</h4>
          <el-descriptions
            :column="2"
            border
          >
            <el-descriptions-item label="创建时间">{{currentDetail.createAt}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{currentDetail.updateAt}}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref, reactive, nextTick} from 'vue'
import TableSearch from '../components/TableSearch.vue';
import {getEmotionPage} from '../api/admin'
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteEmotion } from '../api/admin';

const detailDialogVisible = ref(false)
const currentDetail = ref(null)

//删除
const handleDelete = (res) => {
  ElMessageBox.confirm('确认删除这条记录吗','删除确认',{
    confirmButtonText:'确定',
    cancelButtonText:'取消',
    type:'danger'
  }).then(() => {
    // 确认删除
    deleteEmotion(res.id).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      // 刷新列表
      handleSearch()
    })
    // 刷新列表
    handleSearch()
  }).catch(() => {
    // 取消删除
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}
//列表
const tableData = ref([])
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}


const formItem =[{
    comp:'input', prop:'userId', label:'用户ID', placeholder:'请输入用户ID'
},
{
    comp:'select', prop:'modScreRange', label:'情绪评分', placeholder:'请选择评分范围',
    options:[
        {
            label:'低分(1-3分)',
            value:'1-3'
        },
        {
            label:'中分(4-6分)',
            value:'4-6'
        },
        {
            label:'高分(7-9分)',
            value:'7-10'
        },
    ]
}]
//分页参数
const pagination = reactive({
    currentPage:1,
    size:10,
    total:0
})

const records = ref([])
const total = ref(0)

const handleSearch = async (formData) => {
    //合并分页参数
    const params = {
        ...pagination,
        ...formData
    }
    const { records, total } = await getEmotionPage(params)
    tableData.value = records
    pagination.total = total
    console.log(tableData.value,'列表数据')
    console.log(records,'数据')

}

onMounted(() => {
  handleSearch()
})

//查看会话详情
const aiData = ref(null)
const viewSessionDetail = (row) => {
  detailDialogVisible.value = true
  currentDetail.value = row
  if(row.aiEmotionAnalysis){
    aiData.value = JSON.parse(row.aiEmotionAnalysis)
  }else{
    aiData.value = {}
  }
}



</script>

<style >
:deep(.el-scrollbar__view){
  width: 100%;

}
.ai-suggestion-section{
  width: auto;
  text-align: left;
  background-color: #f5f7fa;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
.ai-risk-section{
  width: auto;
  text-align: left;
  background-color: #f5f7fa;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
.ai-improvements-section{
  width: auto;
  text-align: left;
  background-color: #f5f7fa;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
.suggestion-content{
  width: auto;
  text-align: left;
  background-color: white;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
.risk-content{
  width: auto;
  text-align: left;
  background-color: white;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
.improvement-list{
  width: auto;
  text-align: left;
  background-color: white;
  padding:8px 11px;
  border:1px solid;
  border-color: #ebeef5;
  margin-bottom: 10px
}
</style>