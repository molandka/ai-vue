import service from '../utils/requests'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export function login(data){
    return service.post('/user/login', data)
}
export function categoryTree(){
    return service.get('/knowledge/category/tree')

}
export function articlepage(params){
    return service.get('/knowledge/article/page',{params})
}
export function createArticle(data){
    return service.post('/knowledge/article', data)
}
export function getArticleDetail(id){
    return service.get(`/knowledge/article/${id}`)
}
export function updateArticle(id,data){
    return service.put(`/knowledge/article/${id}`, data)
}
export function deleteArticle(id){
    return service.delete(`/knowledge/article/${id}`)
}
export function changeArticleStatus(id,data){
    return service.put(`/knowledge/article/${id}/status`,data)
}
export function uploadFiled(File,businessInfo){
    const formData = new FormData()
    formData.append('file', File)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.bussinessId)
    formData.append('businessField', 'cover')
    return service.post('/file/upload', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

}

export function getConsultationPage(params){
    return service.get('/psychological-chat/sessions',{params})
}
export function getSessionDetail(sessionId){
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionPage(params){
    return service.get('/emotion-diary/admin/page',{params})
}
export function deleteEmotion(id){
    return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalyticsOverview(){
    return service.get('/data-analytics/overview')
}

export function logout(){
    return service.post('/user/logout')
}

export function register(formData){
    return service.post('/user/add', formData)
}

export const psychologicalChatStream = (sessionId, userMessage, onMessage, onError) => {
    const token = localStorage.getItem('token')
    return new Promise((resolve, reject) => {
        fetchEventSource('/api/psychological-chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                userMessage: userMessage
            }),
            onmessage: (event) => {
                if (event.data && event.data !== '[DONE]') {
                    try {
                        const parsed = JSON.parse(event.data)
                        if (parsed.data && parsed.data.content && onMessage) {
                            onMessage(parsed.data.content)
                        }
                    } catch (e) {
                        console.error('JSON解析失败:', e)
                    }
                }
            },
            onerror: (error) => {
                if (onError) {
                    onError(error)
                }
                reject(error)
            },
            onclose: () => {
                resolve()
            }
        })
    })
}

export const startNewSession = (initialMessage, sessionTitle) => {
    return service.post('/psychological-chat/session/start', {
        initialMessage: initialMessage,
        sessionTitle: sessionTitle
    })
}
