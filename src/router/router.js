import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'calendar',
    component: () => import(/* webpackChunkName: "about" */ '../views/calendar/Calendar.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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