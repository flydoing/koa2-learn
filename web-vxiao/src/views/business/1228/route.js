/**
 * 路由
 */
export default [
  { path: '1228/periodicSetting', name: 'periodicSetting1228', component: resolve => require(['./PeriodicSetting'], resolve) },
  { path: '1228/periodicEdit', name: 'periodicEdit1228', component: resolve => require(['./PeriodicEdit'], resolve) },
  { path: '1228/selectTime', name: 'selectTime1228', component: resolve => require(['./SelectTime'], resolve) },
  { path: '1228/selectRange', name: 'selectRange1228', component: resolve => require(['./SelectRange'], resolve) }
]
