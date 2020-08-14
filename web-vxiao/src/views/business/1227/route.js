export default [
  { path: '1227/setup/add', component: resolve => require(['./setup/Add'], resolve), meta: { keepAlive: true } },
  { path: '1227/setup/detail', component: resolve => require(['./setup/Detail'], resolve), meta: { keepAlive: true } },
  { path: '1227/setup/ip', component: resolve => require(['./setup/Ip'], resolve) }
]
