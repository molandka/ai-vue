<template>
    <el-dialog
        :title="isEdit ? '编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title" label-width="120px">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable/>
            </el-form-item>
            <el-form-item label="文章分类" prop="categoryId" label-width="120px">
                <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
                    <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary" label-width="120px">
                <el-input v-model="formData.summary" type="textarea" placeholder="请输入文章摘要(可选)" :rows="4" show-word-limit clearable maxlength="1000"/>
            </el-form-item>
            <el-form-item label="标签" prop="tags" label-width="120px">
                <el-select v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create style="width: 100%;" clearable>
                    <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-load">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :before-upload="beforeUpload"
                        :http-request="handleUploadRequest"
                        >
                        <div v-if="!imgUrl" class="cover-placeholder">
                            <p>点击上传封面</p>
                        </div>
                        <img v-else :src="imgUrl" alt="封面图片" class="cover-image" style="width: 200px; height: 120px;">
                    </el-upload>
                    <div v-if="imgUrl" class="cover-remove">
                        <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content" label-width="120px">
                //富文本编辑框
                <Toolbar
                    style="border:1px solid #ccc"
                    :editor="editorRef"
                    :defaultConfig="toolbarConfig"
                    :mode="editorMode"                    
                />
                <Editor
                    style="height: 200px; overflow-y: hidden; width:100%; border:1px solid #ccc;"
                    v-model="valueHtml"
                    :defaultConfig="editorConfig"
                    :mode="editorMode"
                    @onCreated="handleCreated"
                    @onChange="handleEditorChange"                    
                />
            </el-form-item>
        </el-form>
        <div v-if="!btnPreview">
            <p>内容预览</p>
            <div v-html="formData.content"></div>
        </div>
        <template #footer>
            <el-button @click="btnPreview =!btnPreview">{{btnPreview ? '预览效果' : '关闭预览效果'}}</el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit()">{{isEdit ? '更新' : '创建文章'}}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, onBeforeUnmount, shallowRef, onMounted , nextTick, watch} from 'vue'
import { uploadFiled } from '../api/admin'
import { ElMessage } from 'element-plus'
import { fileBaseUrl } from '../config/index.js'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { createArticle, updateArticle } from '../api/admin'


//新增提交功能
const loading = ref(false)
const handleSubmit = () => {
    formRef.value.validate((valid, fields) => {
        if (valid){
            loading.value = true
        }
        console.log(formData,'FromData')
        const submitData = {
            ...formData, 
            tags: formData.tagArray.toString(),
        }
        delete submitData.tagArray
        if (!isEdit.value){
            createArticle(submitData).then(res => {
                ElMessage.success('创建成功')
                loading.value = false
                emit('success')
                handleClose()
                }).catch(() =>{
                ElMessage.error('上传错误')
                loading.value = false        
            })            
        }
        else{
            updateArticle(props.article.id, submitData).then(res => {
                loading.value = false
                emit('success')
                handleClose
            })

        }
        
    })
}

const formRef = ref()
//预览效果
const btnPreview = ref(false)

const handleEditorChange = (editor) => {
    formData.content = editor.getHtml()
}
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

const editorMode = ref('default')

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入文章内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor
}

//标签
const commonTags = [
    '情绪管理','焦虑','压力','睡眠',
    '冥想','正念','放松','心理健康','自我成长',
    '人际关系','工作压力','学习方法','生活技巧',
]

//上传
const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!file.type.startsWith('image/')) {
        ElMessage.error('请上传图片文件')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB')
        return false
    }
    return true
}

const businessId = ref()

//调用上传接口
const handleUploadRequest = async({file}) => {
    //uid生成
    await nextTick()
    businessId.value = crypto.randomUUID

    const fileRes = await uploadFiled(file, {
        bussinessId: businessId.value,
    })
    console.log(fileRes)
    //拼接图片地址
    imgUrl.value = fileBaseUrl + fileRes.filePath
    formData.coverImage = fileRes.filePath
}

//移除封面
const handleRemove = () => {
    imgUrl.value = ''
    formData.coverImage = ''
}

const imgUrl = ref('')

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    },
})

//判断编辑还是新增
const isEdit = computed(() => !!props.article?.id)

//表单数据
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max: 10000, message: '文章内容最多10000个字符', trigger: 'blur' }
    ],
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
    get: () => {
        return props.modelValue
    },
    set: (val) => {
        emit('update:modelValue', val)
    }
})

const handleClose = () => {
    //重置表单
    formRef.value.resetFields()
    //重置ID
    businessId.value = null
    //重置封面图片和数据
    handleRemove()
    //重置标签
    formData.tagArray = []
    emit('update:modelValue', false)
    
}
//监听编辑数据
watch(() => props.article, (newVal) =>{
    if (newVal) {
        nextTick(() =>{
            Object.assign(formData, newVal)
            //使用现有的id
            businessId.value = newVal.id
            //封面图片url
            imgUrl.value = fileBaseUrl + newVal.coverImage
        })

    }
})
</script>

<style scoped>
.cover-placeholder{
    width:200px;
    height:120px;
    display:flex;
    flex-direction: column;
    color: #8b949e;
    background-color: #f6f8fa;
    align-items: center;
    justify-content: center;
}
</style>