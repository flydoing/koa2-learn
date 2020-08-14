/**
 * CRM项目公用路由
 */
export default [
  { path: '1085/childCardList', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1085/productAmount', component: resolve => require(['./ProductAmount'], resolve) }
]
