import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/calendar',
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import(/* webpackChunkName: "about" */ '../views/calendar/Calendar.vue')
  },
  {
    path: '/managementList',
    name: 'managementList',
    component: () => import(/* webpackChunkName: "about" */ '../views/list/List.vue')
  },
  {
    path: '/applicationList',
    name: 'applicationList',
    component: () => import(/* webpackChunkName: "about" */ '../views/list/List.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
