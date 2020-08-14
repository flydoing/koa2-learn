/**
 * 工资单公用路由
 */
export default [
  { path: '1064/SelectGroup', name: 'selectGroup1064', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1064/ImportView', name: 'importView1064', component: resolve => require(['./ImportView'], resolve) }
]
