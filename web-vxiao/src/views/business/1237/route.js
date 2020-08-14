/**
 * 考勤公用路由
 */
export default [
  { path: '1237/childCardList', name: 'childCardList1237', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1237/pathogenySetting', name: 'pathogenySetting1237', component: resolve => require(['./PathogenySetting'], resolve) },
  { path: '1237/selectTemplate', name: 'selectTemplate1237', component: resolve => require(['./SelectTemplate'], resolve) },
  { path: '1237/timeSetting', name: 'timeSetting1237', component: resolve => require(['./TimeSetting'], resolve) },
  { path: '1237/nodeEdit', name: 'nodeEdit1237', component: resolve => require(['./NodeEdit'], resolve) },
  { path: '1237/selectGroup', name: 'selectGroup1237', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1237/selectType', name: 'selectType1237', component: resolve => require(['./SelectType'], resolve) },
  { path: '1237/illCondition', name: 'illCondition1237', component: resolve => require(['./IllCondition'], resolve) },
  { path: '1237/selectStudent', name: 'selectStudent1237', component: resolve => require(['./SelectStudent'], resolve) },
  { path: '1237/diseaseReport', name: 'diseaseReport1237', component: resolve => require(['./DiseaseReport'], resolve) },
  { path: '1237/diseaseReportEdit', name: 'diseaseReportEdit1237', component: resolve => require(['./DiseaseReportEdit'], resolve) },
  { path: '1237/selectSymptom', name: 'selectSymptom1237', component: resolve => require(['./SelectSymptom'], resolve) },
  { path: '1237/selectPathogeny', name: 'selectPathogeny1237', component: resolve => require(['./SelectPathogeny'], resolve) },
  { path: '1237/selectClass', name: 'selectClass1237', component: resolve => require(['./SelectClass'], resolve) },
  { path: '1237/wifiSetting', name: 'wifiSetting1237', component: resolve => require(['./WifiSetting'], resolve) },
  { path: '1237/wifiEdit', name: 'wifiEdit1237', component: resolve => require(['./WifiEdit'], resolve) },
  { path: '1237/overtimeSetting', name: 'overtimeSetting1237', component: resolve => require(['./OvertimeSetting'], resolve) }
]
