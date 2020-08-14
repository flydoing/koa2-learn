/**
 * 考勤公用路由
 */
export default [
  { path: '1197/ChildCardList', name: 'childCardList1197', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1197/PathogenySetting', name: 'pathogenySetting1197', component: resolve => require(['./PathogenySetting'], resolve) },
  { path: '1197/SelectTemplate', name: 'selectTemplate1197', component: resolve => require(['./SelectTemplate'], resolve) },
  { path: '1197/TimeSetting', name: 'timeSetting1197', component: resolve => require(['./TimeSetting'], resolve) },
  { path: '1197/NodeEdit', name: 'nodeEdit1197', component: resolve => require(['./NodeEdit'], resolve) },
  { path: '1197/SelectGroup', name: 'selectGroup1197', component: resolve => require(['./SelectGroup'], resolve) }
]
