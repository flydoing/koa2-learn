/**
 * 排课公用路由
 */
export default [
  { path: '1147/modelStep/detail', component: resolve => require(['./modelStep/Detail'], resolve) },
  { path: '1147/classStep/edit', component: resolve => require(['./classStep/Edit'], resolve) },
  { path: '1147/classStep/addMember', component: resolve => require(['./classStep/AddMember'], resolve) },
  { path: '1147/classStep/selectMember', component: resolve => require(['./classStep/SelectMember'], resolve) },
  { path: '1147/teacherStep/edit', component: resolve => require(['./teacherStep/Edit'], resolve) },
  { path: '1147/teacherStep/selectSubject', component: resolve => require(['./teacherStep/SelectSubject'], resolve) },
  { path: '1147/teacherStep/selectCampus', component: resolve => require(['./teacherStep/SelectCampus'], resolve) },
  { path: '1147/teachStep/addMember', component: resolve => require(['./teachStep/AddMember'], resolve) },
  { path: '1147/teachStep/selectMember', component: resolve => require(['./teachStep/SelectMember'], resolve) },
  { path: '1147/roomStep/edit', component: resolve => require(['./roomStep/Edit'], resolve) },
  { path: '1147/roomStep/selectSubject', component: resolve => require(['./roomStep/SelectSubject'], resolve) },
  { path: '1147/ruleStep/rules', component: resolve => require(['./ruleStep/Rules'], resolve) },
  { path: '1147/ruleStep/selectSubject', component: resolve => require(['./ruleStep/SelectSubject'], resolve) },
  { path: '1147/ruleStep/selectGrade', component: resolve => require(['./ruleStep/SelectGrade'], resolve) },
  { path: '1147/ruleStep/selectActivity', component: resolve => require(['./ruleStep/SelectActivity'], resolve) },
  { path: '1147/electiveStep/selectMember', component: resolve => require(['./electiveStep/SelectMember'], resolve) },
  { path: '1147/preview', component: resolve => require(['./Preview'], resolve) },
  { path: '1147/exchange', component: resolve => require(['./Exchange'], resolve) }
]
