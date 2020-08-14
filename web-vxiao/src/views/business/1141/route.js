/**
 * 奖品公用路由
 */
export default [
  { path: '1141/ConvertRecord', name: 'convertRecord1141', component: resolve => require(['./ConvertRecord'], resolve) },
  { path: '1141/RecordDetail', name: 'recordDetail1141', component: resolve => require(['./RecordDetail'], resolve) },
  { path: '1141/PrizeList', name: 'prizeList1141', component: resolve => require(['./PrizeList'], resolve) },
  { path: '1141/PrizeEdit', name: 'prizeEdit1141', component: resolve => require(['./PrizeEdit'], resolve) },
  { path: '1141/ReplenishSet', name: 'replenishSet1141', component: resolve => require(['./ReplenishSet'], resolve) },
  { path: '1141/Replenish', name: 'replenish1141', component: resolve => require(['./Replenish'], resolve) },
  { path: '1141/ExchangePrize', name: 'exchangePrize1141', component: resolve => require(['./ExchangePrize'], resolve) }
]
