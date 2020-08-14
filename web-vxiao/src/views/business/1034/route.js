/**
 * 日志公用路由
 */
export default [
  { path: '1034/AddJournal/:msgId', name: 'addJournal1034', component: resolve => require(['./AddJournal'], resolve) },
  { path: '1034/Journal/:msgId', name: 'journal1034', component: resolve => require(['./Journal'], resolve) },
  { path: '1034/SelectTime', name: 'selectTime1034', component: resolve => require(['./SelectTime'], resolve) }
]
