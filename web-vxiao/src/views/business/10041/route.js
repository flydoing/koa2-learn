export default [
  { path: '10041/categoryEdit', name: 'categoryEdit10041', component: resolve => require(['./CategoryEdit'], resolve) },
  { path: '10041/goodsDeatil', name: 'goodsDetail10041', component: resolve => require(['./GoodsDetail'], resolve) },
  { path: '10041/priceDetail', name: 'priceDetail10041', component: resolve => require(['./PriceDetail'], resolve) },
  { path: '10041/goodsManage', name: 'goodsManage10041', component: resolve => require(['./GoodsManage'], resolve), meta: { keepAlive: true } },
  { path: '10041/goodsTypes', name: 'goodsTypes10041', component: resolve => require(['./GoodsTypes'], resolve) },
  { path: '10041/contentEdit', name: 'contentEdit10041', component: resolve => require(['./ContentEdit.vue'], resolve) }
]
