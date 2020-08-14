/**
 * 巡检公用路由
 */
export default [
  { path: '1216/ChildCardList', name: 'childCardList1216', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1216/InspectionEdit', name: 'inspectionEdit1216', component: resolve => require(['./InspectionEdit'], resolve) },
  { path: '1216/ResultEdit', name: 'resultEdit1216', component: resolve => require(['./ResultEdit'], resolve) },
  { path: '1216/SelectClass', name: 'selectClass1216', component: resolve => require(['./SelectClass'], resolve) },
  { path: '1216/InspectionPlace', name: 'inspectionPlace1216', component: resolve => require(['./InspectionPlace'], resolve) },
  { path: '1216/InspectionProject', name: 'inspectionProject1216', component: resolve => require(['./InspectionProject'], resolve) },
  { path: '1216/ProjectEdit', name: 'projectEdit1216', component: resolve => require(['./ProjectEdit'], resolve) },
  { path: '1216/MemberList', name: 'memberList1216', component: resolve => require(['./MemberList'], resolve) },
  { path: '1216/SelectGroup', name: 'selectGroup1216', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1216/SelectMember', name: 'selectMember1216', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1216/SelectRange', name: 'selectRange1216', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1216/InspectionSchedule', name: 'inspectionSchedule1216', component: resolve => require(['./InspectionSchedule'], resolve) },
  { path: '1216/InspectorList', name: 'inspectorList1216', component: resolve => require(['./InspectorList'], resolve) },
  { path: '1216/SelectInspector', name: 'selectInspector1216', component: resolve => require(['./SelectInspector'], resolve) }
]
