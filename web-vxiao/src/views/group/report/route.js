export default [
  { path: 'report/list/:groupId/:appType', component: resolve => require(['./List'], resolve) },
  { path: 'report/detail/:groupId', name: 'reportDetail', component: resolve => require(['./Detail'], resolve), meta: { keepAlive: true } },
  { path: 'report/chart/:groupId/:templetId', name: 'reportChart', component: resolve => require(['./Chart'], resolve) },
  { path: 'report/message/detail/:refresh', name: 'businessDetail', component: resolve => require(['./Message'], resolve) },
  { path: 'report/setup', name: 'reportTemplates', component: resolve => require(['./Setup'], resolve) },
  { path: 'report/setup/list', name: 'reportTemplateList', component: resolve => require(['./Templates'], resolve) },
  { path: 'report/setup/edit', name: 'reportTemplateEdit', component: resolve => require(['./TemplatesEdit'], resolve) },
  { path: 'report/setup/system', name: 'reportSystemTemplateEdit', component: resolve => require(['./TemplatesSystemEdit'], resolve) },
  { path: 'report/date/change', name: 'reportDateChange', component: resolve => require(['./DateChange'], resolve) },
  { path: 'report/date/customChange', name: 'reportCustomDateChange', component: resolve => require(['./CustomDateChange'], resolve) },
  { path: 'report/customAction', name: 'customAction', component: resolve => require(['./CustomAction'], resolve) }
]
