<template>
    <el-form 
    ref="ruleFormRef"
    :model="formData" 
    >
        <div class="search-row search-row-fields">
            <template v-for="item in formItemAttrs" :key="item.prop">
                <div class="search-col" :class="getColClass(item.col)">
                <el-form-item :label="item.label" :prop="item.prop">
                    <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
                        <template v-if="item.comp === 'select'">
                            <el-option label='全部' value=""></el-option>
                            <el-option v-for="opt in item.options" 
                            :label="opt.label" 
                            :value="opt.value" 
                            :key="opt.value"></el-option>
                        </template>
                    </component>
                </el-form-item>
                </div>
            </template>
        </div>
        <div class="search-row search-row-actions">
            <el-button type="primary" @click="handleSearch(formData)">查询</el-button>
            <el-button  @click="handleReset(ruleFormRef)">重置</el-button>
        </div>
    </el-form>
</template>

<script setup>
import { ref , reactive, computed} from 'vue'
const ruleFormRef = ref()
const handleReset = (formEl) => {
    if(!formEl) return
    formEl.resetFields()
    emit('search', formData)
}
const handleSearch = (formData) => {
    //console.log(formData)
    emit('search', formData)
}

const emit = defineEmits(['search'])
const formItemAttrs = computed(()=> {
    const {formItem} =props
    formItem.forEach(item => {
        item.col = {
            xs:24,
            sm:12,
            md:8,
            lg:6,
            xl:6
        }
    })
    return formItem
})
const formData = reactive({})

const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})

const getColClass = (col) => {
    if (!col) return 'col-24'
    const sizeMap = {
        xs: 'col-xs-',
        sm: 'col-sm-',
        md: 'col-md-',
        lg: 'col-lg-',
        xl: 'col-xl-'
    }
    let classes = []
    for (const [key, value] of Object.entries(col)) {
        if (sizeMap[key]) {
            classes.push(sizeMap[key] + value)
        }
    }
    return classes.join(' ')
}

const isComp = (comp) => {
    return{
    input:'elInput',
    select: 'elSelect',
    }[comp]
}
</script>

<style scoped>
.search-row {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 16px;
}

.search-row-fields {
    gap: 24px;
}

.search-row-actions {
    gap: 12px;
    align-items: center;
}

.search-col {
    box-sizing: border-box;
}

.col-xs-24 { width: 100%; }
.col-xs-12 { width: 50%; }
.col-xs-8 { width: calc(100% / 3); }
.col-xs-6 { width: 25%; }

@media screen and (min-width: 576px) {
    .col-sm-24 { width: 100%; }
    .col-sm-12 { width: 50%; }
    .col-sm-8 { width: calc(100% / 3); }
    .col-sm-6 { width: 25%; }
}

@media screen and (min-width: 768px) {
    .col-md-24 { width: 100%; }
    .col-md-12 { width: 50%; }
    .col-md-8 { width: calc(100% / 3); }
    .col-md-6 { width: 25%; }
}

@media screen and (min-width: 992px) {
    .col-lg-24 { width: 100%; }
    .col-lg-12 { width: 50%; }
    .col-lg-8 { width: calc(100% / 3); }
    .col-lg-6 { width: 25%; }
}

@media screen and (min-width: 1200px) {
    .col-xl-24 { width: 100%; }
    .col-xl-12 { width: 50%; }
    .col-xl-8 { width: calc(100% / 3); }
    .col-xl-6 { width: 25%; }
}
</style>