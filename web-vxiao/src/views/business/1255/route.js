/**
 * 打卡公用路由
 */
export default [
  { path: '1255/selectTime', name: 'selectTime1255', component: resolve => require(['./SelectTime'], resolve) },
  { path: '1255/detail', name: 'detail1255', component: resolve => require(['./Detail'], resolve) },
  { path: '1255/addContent', name: 'addContent1255', component: resolve => require(['./AddContent'], resolve) },
  { path: '1255/users', name: 'users1255', component: resolve => require(['./Users'], resolve) }
]
