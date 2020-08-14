/**
 * 体测公用路由
 */
export default [
  { path: '1153/ProjectSetting', name: 'projectSetting1153', component: resolve => require(['./ProjectSetting'], resolve) },
  { path: '1153/ExportGrades', name: 'exportGrades1153', component: resolve => require(['./ExportGrades'], resolve) },
  { path: '1153/ImportGrades', name: 'importGrades1153', component: resolve => require(['./ImportGrades'], resolve) },
  { path: '1153/ImportView', name: 'importView1153', component: resolve => require(['./ImportView'], resolve) }
]
