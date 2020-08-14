/**
 * 评价总结公用路由
 */
export default [
  { path: '1222/objects/:msgId', name: 'objects1222', component: resolve => require(['./Objects'], resolve) },
  { path: '1222/addSummary/:msgId', name: 'addSummary1222', component: resolve => require(['./AddSummary'], resolve) },
  { path: '1222/selectRange', name: 'selectRange1222', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1222/importView', name: 'importView1222', component: resolve => require(['./ImportView'], resolve) },
  { path: '1222/selectComment', name: 'selectComment1222', component: resolve => require(['./SelectComment'], resolve) }
]
