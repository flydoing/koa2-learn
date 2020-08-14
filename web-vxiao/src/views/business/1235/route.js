/**
 * 请假公用路由
 */
export default [
  { path: '1235/ruleEdit', name: 'ruleEdit1235', component: resolve => require(['./RuleEdit'], resolve) },
  { path: '1235/selectMember', name: 'selectMember1235', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1235/selectLeaveMember', name: 'selectLeaveMember1235', component: resolve => require(['./SelectLeaveMember'], resolve) },
  { path: '1235/studentLeaveType', name: 'studentLeaveType1235', component: resolve => require(['./StudentLeaveType'], resolve) },
  { path: '1235/illCondition', name: 'illCondition1235', component: resolve => require(['./IllCondition'], resolve) },
  { path: '1235/selectHandler', name: 'selectHandler1235', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1235/teacherLeaveType', name: 'teacherLeaveType1235', component: resolve => require(['./TeacherLeaveType'], resolve) },
  { path: '1235/typeSetting', name: 'typeSetting1235', component: resolve => require(['./TypeSetting'], resolve) },
  { path: '1235/ruleSetting', name: 'ruleSetting1235', component: resolve => require(['./RuleSetting'], resolve) },
  { path: '1235/executorEdit', name: 'executorEdit1235', component: resolve => require(['./ExecutorEdit'], resolve) }
]
