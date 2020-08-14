/**
 * 家长评价公用路由
 */
export default [
  { path: '1200/detailList', name: 'detailList1200', component: resolve => require(['./DetailList'], resolve) },
  { path: '1200/previewList', name: 'previewList1200', component: resolve => require(['./PreviewList'], resolve) },
  { path: '1200/selectGroup', name: 'selectGroup1200', component: resolve => require(['./SelectGroup'], resolve) }
]
