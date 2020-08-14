export default [
  { path: 'catalog', component: resolve => require(['./Index'], resolve) },
  { path: 'catalogDetail', component: resolve => require(['./CatalogMsgList'], resolve) }
]
