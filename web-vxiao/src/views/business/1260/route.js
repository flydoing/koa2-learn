/**
 * 家访公用路由
 */
export default [
  { path: '1260/templateSetting', name: 'templateSetting1260', component: resolve => require(['./TemplateSetting'], resolve) },
  { path: '1260/templateEdit', name: 'templateEdit1260', component: resolve => require(['./TemplateEdit'], resolve) },
  { path: '1260/selectTemplate', name: 'selectTemplate1260', component: resolve => require(['./SelectTemplate'], resolve) },
  { path: '1260/detail', name: 'detail1260', component: resolve => require(['./Detail'], resolve) },
  { path: '1260/feedback', name: 'feedback1260', component: resolve => require(['./Feedback'], resolve) },
  { path: '1260/selectAddress', name: 'selectAddress1260', component: resolve => require(['./SelectAddress'], resolve) },
  { path: '1260/locationDetail', name: 'locationDetail1260', component: resolve => require(['./LocationDetail'], resolve) },
  { path: '1260/chartDetail', name: 'chartDetail1260', component: resolve => require(['./ChartDetail'], resolve) },
  { path: '1260/chartCloud', name: 'chartCloud1260', component: resolve => require(['./ChartCloud'], resolve) },
  { path: '1260/selectMember', name: 'selectMember1260', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1260/questionList', name: 'questionList1260', component: resolve => require(['./QuestionList'], resolve) }
]
