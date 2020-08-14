export default [
  {
    path: '1282/add',
    component: resolve => require(['./Add'], resolve),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1282/detail',
    component: resolve => require(['./Detail'], resolve),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1282/setup',
    component: resolve => require(['./Setup'], resolve)
  }
]
