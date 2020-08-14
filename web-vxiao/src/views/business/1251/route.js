export default [
  {
    path: '1251/setup/users',
    component: resolve => require(['./setup/Users'], resolve)
  },
  {
    path: '1251/setup/batch',
    component: resolve => require(['./setup/Batch'], resolve)
  }
]
