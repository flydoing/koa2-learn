/**
 * 学科评价公用路由
 */
export default [
  { path: '1230/ChildCardList', name: 'childCardList1230', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1230/TemplateSetting', name: 'templateSetting1230', component: resolve => require(['./TemplateSetting'], resolve) },
  { path: '1230/GradeList', name: 'gradeList1230', component: resolve => require(['./GradeList'], resolve) },
  { path: '1230/TemplateDetail', name: 'templateDetail1230', component: resolve => require(['./TemplateDetail'], resolve) },
  { path: '1230/CategoryEdit', name: 'categoryEdit1230', component: resolve => require(['./CategoryEdit'], resolve) },
  { path: '1230/SelectSubject', name: 'selectSubject1230', component: resolve => require(['./SelectSubject'], resolve) },
  { path: '1230/SelectKnowledge', name: 'selectKnowledge1230', component: resolve => require(['./SelectKnowledge'], resolve) }
]
