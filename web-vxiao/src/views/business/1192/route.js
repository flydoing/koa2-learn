export default [{
  path: '1192/detail/detailIndex',
  component: resolve => require(['./detail/DetailIndex'], resolve),
  name: 'detailIndex1192'
}, {
  path: '1192/detail/createComment',
  component: resolve => require(['./detail/CreateComment'], resolve),
  name: 'createComment1192'
}, {
  path: '1192/detail/publicCourseCommentDetail',
  component: resolve => require(['./detail/PublicCourseCommentDetail'], resolve),
  name: 'publicCourseCommentDetail1192'
}, {
  path: '1192/setup/templateList',
  component: resolve => require(['./setup/EvaluationTemplateList'], resolve),
  name: 'templateList1192'
}, {
  path: '1192/setup/templateAdd',
  component: resolve => require(['./setup/TemplateAdd'], resolve),
  name: 'templateAdd1192'
}, {
  path: '1192/setup/templateSubjects',
  component: resolve => require(['./setup/SubjectList'], resolve),
  name: 'templateSubjects1192'
}, {
  path: '1192/setup/templateCommentResult',
  component: resolve => require(['./setup/TemplateCommentResult'], resolve),
  name: 'templateCommentResult1192'
}, {
  path: '1192/setup/resultCreateAndEdit',
  component: resolve => require(['./setup/ResultCreateAndEdit'], resolve),
  name: 'ResultCreateAndEdit1192'
}, {
  path: '1192/setup/projectCreateAndEdit',
  component: resolve => require(['./setup/ProjectEdit'], resolve),
  name: 'projectCreateAndEdit1192'
}, {
  path: '1192/teacherList',
  component: resolve => require(['./TeacherList'], resolve),
  name: 'teacherList1192'
}, {
  path: '1192/publicCourseSubject',
  component: resolve => require(['./PublicCourseSubject'], resolve),
  name: 'publicCourseSubject1192'
}, {
  path: '1192/publicCourseTemplates',
  component: resolve => require(['./PublicCourseTemplates'], resolve),
  name: 'publicCourseTemplates1192'
}, {
  path: '1192/publicCourseEdit',
  component: resolve => require(['./AppCreate'], resolve),
  name: 'publicCourseEdit1192'
}]
