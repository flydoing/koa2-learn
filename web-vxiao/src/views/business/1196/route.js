/**
 * 学生评估公用路由
 */
export default [
  { path: '1196/Objects/:msgId', name: 'apslObjects1196', component: resolve => require(['./Objects'], resolve) },
  { path: '1196/Detail/:msgId', name: 'apslDetail1196', component: resolve => require(['./Detail'], resolve) },
  { path: '1196/TemplateSetting', name: 'templateSetting1196', component: resolve => require(['./TemplateSetting'], resolve) },
  { path: '1196/TemplateDetail', name: 'templateDetail1196', component: resolve => require(['./TemplateDetail'], resolve) },
  { path: '1196/ProjectEdit', name: 'projectEdit1196', component: resolve => require(['./ProjectEdit'], resolve) },
  { path: '1196/ResultList', name: 'resultList1196', component: resolve => require(['./ResultList'], resolve) },
  { path: '1196/ResultEdit', name: 'resultEdit1196', component: resolve => require(['./ResultEdit'], resolve) },
  { path: '1196/ScoreEdit', name: 'scoreEdit1196', component: resolve => require(['./ScoreEdit'], resolve) },
  { path: '1196/SelectRange', name: 'selectRange1196', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1196/SelectCase', name: 'selectCase1196', component: resolve => require(['./SelectCase'], resolve) },
  { path: '1196/AddContent', name: 'addContent1196', component: resolve => require(['./AddContent'], resolve) }
]
