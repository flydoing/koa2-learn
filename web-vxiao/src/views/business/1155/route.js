/**
 * 体检公用路由
 */
export default [
  { path: '1155/ProjectSetting', name: 'projectSetting1155', component: resolve => require(['./ProjectSetting'], resolve) },
  { path: '1155/ImportReport', name: 'importReport1155', component: resolve => require(['./ImportReport'], resolve) },
  { path: '1155/ImportView', name: 'importView1155', component: resolve => require(['./ImportView'], resolve), meta: { span: 16 } }
]
