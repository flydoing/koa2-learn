/**
 * 教师评估公用路由
 */
export default [
  { path: '1178/Objects/:msgId', name: 'apslObjects1178', component: resolve => require(['./Objects'], resolve) },
  { path: '1178/Detail/:msgId', name: 'apslDetail1178', component: resolve => require(['./Detail'], resolve) },
  { path: '1178/Answers', name: 'apslAnswers1178', component: resolve => require(['./Answers'], resolve) },
  { path: '1178/CaseSetting', name: 'caseSetting1178', component: resolve => require(['./CaseSetting'], resolve) },
  { path: '1178/CaseEdit', name: 'caseEdit1178', component: resolve => require(['./CaseEdit'], resolve) },
  { path: '1178/QuestionEdit', name: 'questionEdit1178', component: resolve => require(['./QuestionEdit'], resolve) },
  { path: '1178/SelectRange', name: 'selectRange1178', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1178/SelectGroup', name: 'selectGroup1178', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1178/SelectMember', name: 'selectMember1178', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1178/SelectCase', name: 'selectCase1178', component: resolve => require(['./SelectCase'], resolve) },
  { path: '1178/SelectRole', name: 'selectRole1178', component: resolve => require(['./SelectRole'], resolve) },
  { path: '1178/SelectClass', name: 'selectClass1178', component: resolve => require(['./SelectClass'], resolve) },
  { path: '1178/AddRemark', name: 'addRemark1178', component: resolve => require(['./AddRemark'], resolve) }
]
