/**
 * 任务公用路由
 */
export default [
  { path: '1129/Detail/:msgId', name: 'detail1129', component: resolve => require(['./Detail'], resolve) },
  { path: '1129/CommitTask/:msgId', name: 'commitTask1129', component: resolve => require(['./CommitTask'], resolve) }
]
