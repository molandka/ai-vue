<template>
  <div class="rich-text-editor">
    <div class="editor-container" style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="default"
        class="editor-toolbar"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="content"
        :defaultConfig="editorConfig"
        :mode="default"
        class="wang-editor"
        @onCreated="handleEditorCreated"
        @onDestroyed="handleEditorDestroyed"
      />
    </div>
    <div v-if="showWordCount" class="editor-footer">
      <div class="word-count">
        <span class="count-text">{{ currentCharCount }}/{{ maxCharCount }}</span>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: Math.min((currentCharCount / maxCharCount) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { computed, onBeforeUnMount, watch, onBeforeUnmount, ref, shallowRef, onMounted, reactive } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { ElMessage } from 'element-plus'
  import { Editor as WangEditor, Toolbar as WangToolbar } from '@wangeditor/editor-for-vue'
  import { placeholderSign } from 'element-plus/es/components/table-v2/src/private.mjs'

  const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholderSign: {
        type: String,
        default: '请输入内容...'
    },
    showSecurity: {
        type: Boolean,
        default: true
    },
    toolbarKeys: {
        type: Array,
        default: () => [
          'bold','|',
          'italic','|',
          'underline','|',
          'strikeThrough','|',
          'subscript','|',
          'superscript','|',
          'quote','|',
          'code','|',
          'image','|',
          'video','|',
          'table','|',
          'link','|',
          'list','|',
          'hr','|',
          'html','|',
        ]
    }
  })
  //Emints
  const emit = defineEmits(['created','change','destroyed'])

  //响应式数据
  const editorRef = shallowRef(null)
  const currentCharCount = ref(0)

  //计算属性
  const content = computed({
    get: () => {
      props.modelValue
    },
    set: (val) => emit('update:modelValue', val)
  })
  //编辑器配置
  const editorConfig = reactive({
    placeholder: props.placeholderSign,
    MENU_CONF:{
      fontSize:{
        fontSizeList: ['12px', '14px', '16px', '20px', '24px', '32px'],
      },
      fontFamily:{
        fontFamilyList: ['Arial', 'Tahoma', 'Verdana', '微软雅黑'],
      }
    }
  })
  const toolbarConfig = reactive({
    toolbarKeys: props.toolbarKeys
  })
  const handleEditorCreated = (editor) => {
    editorRef.value = editor
    updateCharCount()
    console.log('编辑器实例',editor)
    console.log('工具栏配置',editor.getConfig())

    const menus = editor.getAllMenuKeys()
    console.log('所有可用菜单',menus)

    if (menus.include('fontFamily')){
      console.log('字体菜单已启用')
    }
    else{
      console.log('字体菜单未启用')
    }
    emit('created',editor)
    console.log('富文本编辑器创建完成')
  }
  const handleEditorChange = (editor) =>{
    updateCharCount()

    emit('change',{
      html:editor.getHtml(),
      text:editor.getText()
    })
  }
  const handleEditorDestroyed = () =>{
    editorRef.value = null
    console.log('富文本编辑器销毁完成')
  }
  const updateCharCount = () =>{
    currentCharCount.value = editorRef.value.getText().length
  }
  export default {
    components: { Editor, Toolbar },
    setup() {
      // 编辑器实例，必须用 shallowRef
      const editorRef = shallowRef()

      // 内容 HTML
      const valueHtml = ref('<p>hello</p>')

      // 模拟 ajax 异步获取内容
      onMounted(() => {
        setTimeout(() => {
          valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
        }, 1500)
      })

      const toolbarConfig = {}
      const editorConfig = { placeholder: '请输入内容...' }

      // 组件销毁时，也及时销毁编辑器
      onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
      })

      const handleCreated = (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
      }

      return {
        editorRef,
        valueHtml,
        mode: 'default', // 或 'simple'
        toolbarConfig,
        editorConfig,
        handleCreated,
      }
    },
  }
</script>