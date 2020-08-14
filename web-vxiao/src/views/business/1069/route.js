export default [{
  path: '1069/teacherReview',
  component: resolve => require(['./detail/TeacherReview'], resolve),
  name: 'teacherReview1069'
}, {
  path: '1069/studentReview',
  component: resolve => require(['./detail/StudentReview'], resolve),
  name: 'studentReview1069'
}, {
  path: '1069/studentReply',
  component: resolve => require(['./detail/StudentReply'], resolve),
  name: 'studentReply1069'
}, {
  path: '1069/annotation',
  component: resolve => require(['./detail/AnnotationDetail'], resolve),
  name: 'annotation1069'
}, {
  path: '1069/createPreview',
  component: resolve => require(['./CreatePreview'], resolve),
  name: 'createPreview1069'
}, {
  path: '1069/modifyPostil',
  component: resolve => require(['./ModifyPostil'], resolve),
  name: 'modifyPostil1069'
}, {
  path: '1069/catalog',
  component: resolve => require(['./ReadingCatalog'], resolve),
  name: 'catalog1069'
}, {
  path: '1069/pushList',
  component: resolve => require(['./ReadingPushList'], resolve),
  name: 'pushList1069'
}, {
  path: '1069/pushDetail',
  component: resolve => require(['./ReadingPushDetail'], resolve),
  name: 'pushDetail1069'
}]
