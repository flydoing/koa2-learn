/**
 * V屏公用路由
 */
export default [
  { path: '1051/Detail/:msgId', name: 'detail1051', component: resolve => require(['./Detail'], resolve) },
  { path: '1051/selectRange', name: 'selectRange1051', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1051/selectTemplate', name: 'selectTemplate1051', component: resolve => require(['./SelectTemplate'], resolve) }
]
