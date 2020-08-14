export default [
  {
    path: '1279/add',
    component: resolve => require(['./Add'], resolve),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1279/detail',
    component: resolve => require(['./Detail'], resolve),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1279/device',
    component: resolve => require(['./Device'], resolve)
  },
  {
    path: '1279/places',
    component: resolve => require(['./Places'], resolve)
  },
  {
    path: '1279/agreement',
    component: resolve => require(['./Agreement'], resolve)
  },
  {
    path: '1279/server',
    component: resolve => require(['./Server'], resolve)
  }
]
