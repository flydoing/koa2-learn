export default [
  { path: '1150/setup/detail', component: resolve => require(['./setup/Detail'], resolve) },
  { path: '1150/setup/add', component: resolve => require(['./setup/Add'], resolve) },
  { path: '1150/addBook', name: 'addBook1150', component: resolve => require(['./AddBook'], resolve) },
  { path: '1150/abandonedBook', name: 'abandonedBook1150', component: resolve => require(['./AbandonedBook'], resolve) },
  { path: '1150/selectBookType', name: 'selectBookType1150', component: resolve => require(['./SelectBookType'], resolve) },
  { path: '1150/detail', name: 'detail1150', component: resolve => require(['./Detail'], resolve) }
]
