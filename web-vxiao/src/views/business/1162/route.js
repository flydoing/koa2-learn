export default [
  { path: '1162/childrenList', component: resolve => require(['./AppDetail'], resolve), name: 'childrenList1162' },
  { path: '1162/cardDetail', component: resolve => require(['./CardDetail'], resolve), name: 'cardDetail1162' },
  { path: '1162/selectMember', component: resolve => require(['./SelectMember'], resolve), name: 'selectMember1162' },
  { path: '1162/selectPost', component: resolve => require(['./SelectPost'], resolve), name: 'selectPost1162' },
  { path: '1162/selectPlace', component: resolve => require(['./selectPlace.vue'], resolve), name: 'selectPlace1162' },
  { path: '1162/selectClass', component: resolve => require(['./selectClass.vue'], resolve), name: 'selectClass1162' }
]
