/**
 * CRM合同公用路由
 */
export default [
  { path: '1065/selectProduct', component: resolve => require(['./SelectProduct'], resolve) },
  { path: '1065/productInfo', component: resolve => require(['./ProductInfo'], resolve) },
  { path: '1065/payInfo', component: resolve => require(['./PayInfo'], resolve) },
  { path: '1065/detail', component: resolve => require(['./Detail'], resolve) }
]
