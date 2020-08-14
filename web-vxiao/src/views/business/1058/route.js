export default [
  { path: '1058/Detail/:msgId', name: 'detail1058', component: resolve => require(['./Detail'], resolve) },
  { path: '1058/DetailMenuList', name: 'detailMenuList1058', component: resolve => require(['./DetailMenuList'], resolve) },
  { path: '1058/mealTimeManage', name: 'mealTimeManage1058', component: resolve => require(['./setup/MealTimeManage'], resolve) },
  { path: '1058/consumption', name: 'consumption1058', component: resolve => require(['./setup/Consumption'], resolve) },
  { path: '1058/consumptionDetail', name: 'consumptionDetail1058', component: resolve => require(['./setup/ConsumptionDetail'], resolve) },
  { path: '1058/foodLibrary', name: 'foodLibrary1058', component: resolve => require(['./setup/FoodLibrary'], resolve) },
  { path: '1058/modifyFood', name: 'modifyFood1058', component: resolve => require(['./setup/ModifyFood'], resolve) },
  { path: '1058/canteenManage', name: 'canteenManage1058', component: resolve => require(['./setup/CanteenManage'], resolve) },
  { path: '1058/addFoods', name: 'addFoods1058', component: resolve => require(['./AddFoods'], resolve) },
  { path: '1058/selectFood', name: 'selectFood1058', component: resolve => require(['./SelectFood'], resolve) },
  { path: '1058/childrenList', name: 'childrenList1058', component: resolve => require(['./ChildrenList'], resolve) }
]
