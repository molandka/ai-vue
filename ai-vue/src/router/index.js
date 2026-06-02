import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'
import FrontendLayout from '../components/FrontendLayout.vue'

//前台路由
const frontendRoutes = [{
  path: '/',
  component: FrontendLayout,
  children: [{
    path: '',
    component: () => import('../views/Home.vue'),
  },
  {
    path: 'frontendconsultation',
    component: () => import('../views/FrontendConsultation.vue'),
    meta: {
      title: 'AI咨询',
    }
  },
  {
    path: 'emotion-diary',
    component: () => import('../views/EmotionDiary.vue'),
    meta: {
      title: '情绪日志',
    }
  },{
    path: 'frontendknowledge',
    component: () => import('../views/FrontendKnowledge.vue'),
    meta: {
      title: '知识库',
    }
  }


  ]
}]


//后台路由
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: () => import('../components/Backendlayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        }
      },
      {
        path: 'knowledge',
        component: () => import('../views/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        }
      },
      {
        path: 'consultation',
        component: () => import('../views/Consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Notebook',
        }
      },
      {
        path: 'emotion',
        component: () => import('../views/Emotion.vue'),
        meta: {
          title: '情绪日志',
          icon: 'Message',
        }
      },
    ]
  },
  {
    path: '/auth',
    component: () => import('../components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('../views/Login.vue'),
        
      },
      {
        path: 'register',
        component: () => import('../views/Register.vue'),
        
      },
    ]
  }
]

const router =createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {  //用户是否登录
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //如果是后台用户
    if (userInfo.userType == 2){
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    }
    //如果是前台用户
    else if(userInfo.userType == 1){
      if(to.path.startsWith('/back')){
        next('/')
      }else if(to.path.startsWith('/auth/login')){
        next('/')
      }else{
        next()
      }
    }
  } else {
    if (to.path.startsWith('/back')){ //用户未登录，访问后台页面，跳转登录页面
    next('/auth/login')
    }else{
      next()
    }
  }
})
export default router
