// import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import IdCardReader from '@/views/IdCardReader.vue'
import SelfPickup from '@/views/SelfPickup.vue'
// 导入新的视图组件
import InfoEntry from '@/views/InfoEntry.vue'

// Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/id-card-reader'
  },
  {
    path: '/id-card-reader',
    name: 'IdCardReader',
    component: IdCardReader
  },
  {
    path: '/self-pickup',
    name: 'SelfPickup',
    component: SelfPickup
  },
  {
    path: '/info-entry',
    name: 'InfoEntry',
    component: InfoEntry
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由守卫
// router.beforeEach((to, from, next) => {
//   // 页面跳转前
//   next()
// }
// )

export default router