import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store'
import Group from '@/views/group/route'
import Im from '@/views/im/route'
import User from '@/views/my/route'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/html5/',
  routes: [
    { path: '/', name: 'login', component: resolve => require(['@/views/Login'], resolve) },
    { path: '/login', component: resolve => require(['@/views/Login'], resolve) },
    { path: '/loginDzbp', component: resolve => require(['@/views/LoginDzbp'], resolve) },
    { path: '/password', component: resolve => require(['@/views/Password'], resolve) },
    { path: '/modifyPassword', component: resolve => require(['@/views/ModifyPassword'], resolve) },
    { path: '/loginThirdparty', component: resolve => require(['@/views/html5/LoginThirdparty'], resolve) },
    {
      path: '/vx',
      name: 'vx',
      component: resolve => require(['@/views/Index'], resolve),
      children: [
        {
          path: '',
          components: {
            space: resolve => require(['@/views/group/Index'], resolve)
          },
          children: [...Group, ...User, ...Im]
        }
      ]
    },
    { path: '/report/vbracelet/:userId', component: resolve => require(['@/views/business/1218/Chart'], resolve) },
    { path: '*', name: 'page404', component: resolve => require(['@/views/404'], resolve) }
  ]
})

/**
 * 验证
 * @param  {[type]}   to   [description]
 * @param  {[type]}   from [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (Store.state.logined) {
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    next()
  }
})

export default router
