/**
 * 班级勋章公用路由
 */
export default [
  { path: '1144/ChildCardList', name: 'childCardList1144', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1144/MedalSetting', name: 'medalSetting1144', component: resolve => require(['./MedalSetting'], resolve) },
  { path: '1144/MedalEdit', name: 'medalEdit1144', component: resolve => require(['./MedalEdit'], resolve) },
  { path: '1144/DimensionEdit', name: 'dimensionEdit1144', component: resolve => require(['./DimensionEdit'], resolve) },
  { path: '1144/SelectLogo', name: 'selectLogo1144', component: resolve => require(['./SelectLogo'], resolve) },
  { path: '1144/SendMedal', name: 'sendMedal1144', component: resolve => require(['./SendMedal'], resolve) },
  { path: '1144/SelectMember', name: 'selectMember1144', component: resolve => require(['./SelectMember'], resolve) }
]
