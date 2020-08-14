/**
 * 机构信息公用路由
 */
export default [
  { path: '10038/subordinate/:rootId', name: 'subordinate10038', component: resolve => require(['./Subordinate'], resolve) },
  { path: '10038/fields', name: 'fields10038', component: resolve => require(['./Fields'], resolve) },
  { path: '10038/fieldEdit', name: 'fieldEdit10038', component: resolve => require(['./FieldEdit'], resolve) },
  { path: '10038/columnInfo', name: 'columnInfo10038', component: resolve => require(['./ColumnInfo'], resolve) },
  { path: '10038/selectOption', name: 'selectOption10038', component: resolve => require(['./SelectOption'], resolve) }
]
