export default [
  { path: '1207/places/:schoolId', component: resolve => require(['./setup/Place'], resolve) },
  { path: '1207/viots/:placeId', component: resolve => require(['./setup/ViotList'], resolve), name: 'viots' },
  { path: '1207/viots/detail/1', component: resolve => require(['./setup/EntranceDetail'], resolve), name: 'entranceDetail1207' },
  { path: '1207/viots/detail/2', component: resolve => require(['./setup/AirDetail'], resolve) },
  { path: '1207/viots/detail/3', component: resolve => require(['./setup/AirDetail'], resolve) },
  { path: '1207/viots/add/1', component: resolve => require(['./setup/EntranceAdd'], resolve), name: 'entranceAdd1207' },
  { path: '1207/viots/add/2', component: resolve => require(['./setup/AirAdd'], resolve) },
  { path: '1207/viots/add/3', component: resolve => require(['./setup/InfraredAdd'], resolve) },
  { path: '1207/viots/add/brand', component: resolve => require(['./setup/AirBrands'], resolve), name: 'brandSelect1207' },
  { path: '1207/viots/add/model', component: resolve => require(['./setup/AirModels'], resolve), name: 'modelSelect1207' },
  { path: '1207/pattern/add', component: resolve => require(['./AddPattern'], resolve), name: 'addPattern1207' },
  { path: '1207/pattern/details', component: resolve => require(['./setup/PatternDetails'], resolve), name: 'patternDetails1207' },
  { path: '1207/controls', component: resolve => require(['./Controls'], resolve), name: 'controlDetails1207', meta: { keepAlive: true } }
]
