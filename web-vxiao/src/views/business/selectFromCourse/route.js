export default [{
  path: 'selectFromCourse/selectCatalog',
  name: 'courseSelectCatalog',
  component: resolve => require(['./CourseSelectCatalog'], resolve)
}, {
  path: 'selectFromCourse/publishList',
  name: 'courseSelectPublishList',
  component: resolve => require(['./PublishList'], resolve)
}]
