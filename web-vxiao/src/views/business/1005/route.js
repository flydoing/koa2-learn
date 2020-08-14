/**
 * 评价公用路由
 */
export default [
  { path: '1005/MedalSetting', name: 'medalSetting1005', component: resolve => require(['./MedalSetting'], resolve) },
  { path: '1005/MedalEdit/:id', name: 'medalEdit1005', component: resolve => require(['./MedalEdit'], resolve) },
  { path: '1005/MedalCreate', name: 'medalCreate1005', component: resolve => require(['./MedalEdit'], resolve) },
  { path: '1005/SelectLogo', name: 'selectLogo1005', component: resolve => require(['./SelectLogo'], resolve) },
  { path: '1005/SelectMedal', name: 'selectMedal1005', component: resolve => require(['./SelectMedal'], resolve) },
  { path: '1005/ShowSetting/', name: 'showSetting1005', component: resolve => require(['./ShowSetting'], resolve) },
  { path: '1005/AuthSetting/', name: 'authSetting1005', component: resolve => require(['./AuthSetting'], resolve) },
  { path: '1005/ExtraScore', name: 'extraScore1005', component: resolve => require(['./ExtraScore'], resolve) },
  { path: '1005/SendMedal', name: 'sendMedal1005', component: resolve => require(['./SendMedal'], resolve) },
  { path: '1005/SelectDimension', name: 'selectDimension1005', component: resolve => require(['./SelectDimension'], resolve) },
  { path: '1005/SelectRange', name: 'selectRange1005', component: resolve => require(['./SelectRange'], resolve) },
  { path: '1005/AuthEdit', name: 'authEdit1005', component: resolve => require(['./AuthEdit'], resolve) },
  { path: '1005/AddContent/:msgId', name: 'addContent1005', component: resolve => require(['./AddContent'], resolve) },
  { path: '1005/DimensionEdit', name: 'dimensionEdit1005', component: resolve => require(['./DimensionEdit'], resolve) },
  { path: '1005/SelectStudent', name: 'selectStudent1005', component: resolve => require(['./SelectStudent'], resolve) }
]
