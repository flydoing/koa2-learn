/**
 * 巡检子消息公用路由
 */
export default [
  { path: '121601/Detail/:msgId', name: 'detail121601', component: resolve => require(['./Detail'], resolve) },
  { path: '121601/Remarks/:msgId', name: 'remarks121601', component: resolve => require(['./Remarks'], resolve) }
]
