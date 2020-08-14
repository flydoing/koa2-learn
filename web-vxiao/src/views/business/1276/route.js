/**
 * 欢迎词公用路由
 */
export default [
  { path: '1276/Detail/:msgId', name: 'detail1276', component: resolve => require(['./Detail'], resolve) },
  { path: '1276/selectRange', name: 'selectRange1276', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1276/selectTemplate', name: 'selectTemplate1276', component: resolve => require(['./SelectTemplate'], resolve) }
]
