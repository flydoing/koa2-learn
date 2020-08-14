export default [
  { path: '1203/report', component: resolve => require(['./Report'], resolve) },
  { path: '1203/selectApp', component: resolve => require(['./SelectApp'], resolve) },
  { path: '1203/selectSchool', component: resolve => require(['./SelectSchool'], resolve) },
  { path: '1203/selectTerminal', component: resolve => require(['./SelectTerminal'], resolve) },
  { path: '1203/selectMember', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1203/appList', component: resolve => require(['./AppList'], resolve) },
  { path: '1203/handlerManage', component: resolve => require(['./HandlerManage'], resolve), meta: { keepAlive: true } },
  { path: '1203/handlers', component: resolve => require(['./Handlers'], resolve) },
  { path: '1203/addHandler', component: resolve => require(['./AddHandler'], resolve) }
]
