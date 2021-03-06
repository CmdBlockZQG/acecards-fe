import { createRouter, createWebHashHistory } from 'vue-router'

import db from './plugins/db.js'

const routes = [
  {
    path: '/',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/study',
    component: () => import('./views/study/List.vue')
  },
  {
    path: '/study/auto/:id',
    component: () => import('./views/study/Study.vue')
  },
  {
    path: '/study/review/:id',
    component: () => import('./views/study/Review.vue')
  },
  {
    path: '/deck',
    component: () => import('./views/deck/List.vue')
  },
  {
    path: '/deck/new',
    component: () => import('./views/deck/New.vue')
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.beforeEach(async (to, from, next) => {
  if (to.path === '/' || await db.data.get('token')) next()
  else next('/')
})

export default router
