/**
 * 全景公用路由
 */
export default [
  { path: '1209/ChildCardList', name: 'childCardList1209', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1209/AutoMoment', name: 'autoMoment1209', component: resolve => require(['./AutoMoment'], resolve) },
  { path: '1209/MomentEdit', name: 'momentEdit1209', component: resolve => require(['./MomentEdit'], resolve) },
  { path: '1209/SelectMomentPlace', name: 'selectMomentPlace1209', component: resolve => require(['./SelectMomentPlace'], resolve) },
  { path: '1209/SelectWeekday', name: 'selectWeekday1209', component: resolve => require(['./SelectWeekday'], resolve) },
  { path: '1209/EquipmentList', name: 'equipmentList1209', component: resolve => require(['./EquipmentList'], resolve) },
  { path: '1209/EquipmentEdit', name: 'equipmentEdit1209', component: resolve => require(['./EquipmentEdit'], resolve) },
  { path: '1209/SelectPlace', name: 'selectPlace1209', component: resolve => require(['./SelectPlace'], resolve) },
  { path: '1209/InfluencedList', name: 'influencedList1209', component: resolve => require(['./InfluencedList'], resolve) }
]
