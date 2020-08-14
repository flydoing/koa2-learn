/**
 * 问卷公用路由
 */
export default [
  { path: '1042/Detail/:msgId', name: 'detail1042', meta: { keepAlive: true }, component: resolve => require(['./Detail'], resolve) },
  { path: '1042/Answers/:qId', name: 'answers1042', component: resolve => require(['./Answers'], resolve) },
  { path: '1042/QuestionEdit', name: 'questionEdit1042', component: resolve => require(['./QuestionEdit'], resolve) },
  { path: '1042/SelectGroup', name: 'selectGroup1042', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1042/SelectMember', name: 'selectMember1042', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1042/ModifyDeadline', name: 'modifyDeadline1042', component: resolve => require(['./ModifyDeadline'], resolve) }
]
