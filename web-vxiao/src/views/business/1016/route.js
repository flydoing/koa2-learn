/**
 * 公告公用路由
 */
export default [
  { path: '1016/SelectRange', name: 'selectRange1016', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1016/SelectInscription', name: 'selectInscription1016', component: resolve => require(['./SelectInscription'], resolve) },
  { path: '1016/Detail', name: 'detail1016', component: resolve => require(['./Detail'], resolve) }
]
