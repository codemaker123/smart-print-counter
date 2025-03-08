import Vue from 'vue'
import VueRouter from 'vue-router'
// ... 其他导入
import IdCardReader from '@/views/IdCardReader.vue';
import SelfPickup from '@/views/SelfPickup.vue';

Vue.use(VueRouter)

const routes = [
  // 其他路由...
  {
    path: '/id-card-reader',
    name: 'IdCardReader',
    component: IdCardReader
  },
  {
    path: '/self-pickup',
    name: 'SelfPickup',
    component: SelfPickup
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
