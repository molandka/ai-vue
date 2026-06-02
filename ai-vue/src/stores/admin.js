import { defineStore } from 'pinia'
import { ref } from 'vue'
const useAdminStore = defineStore('admin',()=>{
    const isCollpsed = ref(false)
    const toggleCollapse = ()=>{
        isCollpsed.value = !isCollpsed.value
    }
    return {
        isCollpsed,
        toggleCollapse
    }
})
export default useAdminStore