/**
 * 评价公用路由
 */
export default [
  { path: '1264/MedalSetting', name: 'medalSetting1264', component: resolve => require(['./MedalSetting'], resolve) },
  { path: '1264/MedalEdit/:id', name: 'medalEdit1264', component: resolve => require(['./MedalEdit'], resolve) },
  { path: '1264/MedalCreate', name: 'medalCreate1264', component: resolve => require(['./MedalEdit'], resolve) },
  { path: '1264/SelectLogo', name: 'selectLogo1264', component: resolve => require(['./SelectLogo'], resolve) },
  { path: '1264/SelectMedal', name: 'selectMedal1264', component: resolve => require(['./SelectMedal'], resolve) },
  { path: '1264/SendMedal', name: 'sendMedal1264', component: resolve => require(['./SendMedal'], resolve) },
  { path: '1264/AddContent/:msgId', name: 'addContent1264', component: resolve => require(['./AddContent'], resolve) },
  { path: '1264/DimensionEdit', name: 'dimensionEdit1264', component: resolve => require(['./DimensionEdit'], resolve) }
]
