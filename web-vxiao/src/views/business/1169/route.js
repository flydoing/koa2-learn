/**
 * 活动公用路由
 */
export default [
  { path: '1169/detail', name: 'detail1169', component: resolve => require(['./Detail'], resolve) },
  { path: '1169/selectRange', name: 'selectRange1169', component: resolve => require(['./SelectRange'], resolve) }
]
