import Vue from 'vue'
import http from '@/utils/http'
import VueRouter from 'vue-router'

import Route1203 from '@/views/business/1203/route'
import Route1221 from '@/views/business/1221/route'
import Route1055 from '@/views/business/1055/route'
import Route1042 from '@/views/business/1042/route'
import Route1096 from '@/views/business/1096/route'
import Route1138 from '@/views/business/1138/route'
import Route1207 from '@/views/business/1207/route'
import Route1172 from '@/views/business/1172/route'
import Route1186 from '@/views/business/1186/route'
import Route10039 from '@/views/business/10039/route'
import Route10040 from '@/views/business/10040/route'
import Route10041 from '@/views/business/10041/route'
import Route1002 from '@/views/business/1002/routePage'
import RouteBasice from '@/views/business/basice/route'
import Report from '@/views/group/report/route'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/html5/',
  routes: [
    {
      path: '/pages',
      component: resolve => require(['@/views/html5/index'], resolve),
      children: [
        { path: 'ls', component: resolve => require(['@/views/html5/lishui/Login'], resolve) },
        { path: 'hbgd', component: resolve => require(['@/views/html5/hbgd/Login'], resolve) },
        { path: 'auth/login', component: resolve => require(['@/views/html5/Auto'], resolve) },
        { path: 'qrcodePreview', component: resolve => require(['@/views/business/1040/QrcodePreview'], resolve) },
        { path: 'chartCloud', component: resolve => require(['@/views/business/1260/ChartCloud'], resolve) },
        { path: '1039/order/:groupId', component: resolve => require(['@/views/business/1039/Report'], resolve) },
        { path: '1004/attendance/:id', component: resolve => require(['@/views/business/1004/Detail'], resolve) },
        { path: '1152/subjectAssess/chart', component: resolve => require(['@/views/business/1152/Chart'], resolve) },
        { path: '1123/report/chart/:groupId', component: resolve => require(['@/views/business/1123/Chart'], resolve) },
        { path: '1143/detail', component: resolve => require(['@/views/business/114301/Detail'], resolve) },
        { path: '1197/attendance/setting/:id', component: resolve => require(['@/views/business/1197/TimeSetting'], resolve) },
        { path: '1040/qrcode/meeting', component: resolve => require(['@/views/business/1040/Sign'], resolve) },
        { path: '1218/vbracelet/:userId', component: resolve => require(['@/views/business/1218/Chart'], resolve) },
        { path: '1252/chart', component: resolve => require(['@/views/business/1252/Chart'], resolve) },
        { path: '1005/chart/:groupId', component: resolve => require(['@/views/business/1005/Chart'], resolve) },
        { path: '1237/chart/:groupId', component: resolve => require(['@/views/business/1237/Chart'], resolve) },
        { path: '1255/chart', component: resolve => require(['@/views/business/1255/Chart'], resolve) },
        { path: '10039/appCreate', component: resolve => require(['@/views/business/10039/AppCreate'], resolve), meta: { keepAlive: true } },
        { path: '10040/appCreate', component: resolve => require(['@/views/business/10040/AppCreate'], resolve), meta: { keepAlive: true } },
        { path: '10039/report', component: resolve => require(['@/views/business/10039/Report'], resolve) },
        { path: '10040/report', component: resolve => require(['@/views/business/10040/Report'], resolve) },
        { path: '10041/appSetup', component: resolve => require(['@/views/business/10041/AppSetup'], resolve) },
        { path: 'report/chart/:groupId', component: resolve => require(['@/views/group/report/Chart'], resolve) },
        { path: 'app/setup', component: resolve => require(['@/views/group/app/AppsSetup'], resolve) },
        ...Report,
        ...RouteBasice,
        ...Route1203,
        ...Route1221,
        ...Route1055,
        ...Route1042,
        ...Route1207,
        ...Route1172,
        ...Route1186,
        ...Route1002,
        ...Route1096,
        ...Route1138,
        ...Route10040,
        ...Route10039,
        ...Route10041
      ]
    },
    { path: '*', name: 'page404', component: resolve => require(['@/views/404'], resolve) }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.query.tokenId) {
    http.defaults.headers.common['tokenId'] = to.query.tokenId
  }
  if (to.query.clientId) {
    http.defaults.headers.common['ClientId'] = to.query.clientId
  }
  next()
})

export default router
