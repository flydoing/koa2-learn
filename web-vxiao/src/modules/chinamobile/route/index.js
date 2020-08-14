import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store'
import Group from '@/views/group/route'
import Im from '@/modules/chinamobile/im/route'
import User from '@/modules/chinamobile/my/route'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: 'login', component: resolve => require(['@/views/html5/chinamobile/Login'], resolve) },
    { path: '/login', component: resolve => require(['@/views/html5/chinamobile/Login'], resolve) },
    { path: '/passwordThirdparty', component: resolve => require(['@/views/Password'], resolve) },
    {
      path: '/vx',
      name: 'vx',
      component: resolve => require(['@/modules/chinamobile/Index'], resolve),
      children: [
        {
          path: '',
          components: {
            space: resolve => require(['@/modules/chinamobile/group/Index'], resolve)
          },
          children: [...Group, ...User, ...Im, { path: 'member', component: resolve => require(['@/modules/chinamobile/Member'], resolve), meta: { span: 14 } }]
        }
      ]
    },
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
