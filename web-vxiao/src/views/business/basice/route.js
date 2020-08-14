export default [
  {
    path: 'basice/teacher',
    name: 'basiceTeacherIndex',
    component: resolve => require(['./teacher/Teacher'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/teacher/edit',
    name: 'basiceTeacherEdit',
    component: resolve => require(['./teacher/TeacherEdit'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/teacher/group/select',
    name: 'basiceTeacherGroups',
    component: resolve => require(['./teacher/SelectGroup'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/subject',
    name: 'basiceSubjectIndex',
    component: resolve => require(['./subject/Subject'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/subject/edit',
    name: 'basiceSubjectEdit',
    component: resolve => require(['./subject/Edit'], resolve)
  },
  {
    path: 'basice/subject/selectCategory',
    name: 'basiceSubjectSelectCategory',
    component: resolve => require(['./subject/SelectCategory'], resolve)
  },
  {
    path: 'basice/subject/categoryEdit',
    name: 'basiceSubjectCategoryEdit',
    component: resolve => require(['./subject/CategoryEdit'], resolve)
  },
  {
    path: 'basice/place',
    name: 'basicePlaceIndex',
    component: resolve => require(['./place/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/place/adminList',
    name: 'basicePlaceAdmins',
    component: resolve => require(['./place/MemberList'], resolve)
  },
  {
    path: 'basice/place/selectMember',
    name: 'basicePlaceSelectMember',
    component: resolve => require(['./place/SelectMember'], resolve)
  },
  {
    path: 'basice/place/list',
    name: 'basicePlaceList',
    component: resolve => require(['./place/List'], resolve)
  },
  {
    path: 'basice/place/add',
    name: 'basicePlaceAdd',
    component: resolve => require(['./place/Add'], resolve)
  },
  {
    path: 'basice/place/detail',
    name: 'basicePlaceDetail',
    component: resolve => require(['./place/Detail'], resolve)
  },
  {
    path: 'basice/place/add/course',
    name: 'basicePlaceCourse',
    component: resolve => require(['./place/AddCourse'], resolve)
  },
  {
    path: 'basice/place/add/food',
    name: 'basicePlaceAddFood',
    component: resolve => require(['./place/AddFood'], resolve)
  },
  {
    path: 'basice/place/food/select',
    name: 'basicePlaceFoodSelect',
    component: resolve => require(['./place/SelectFood'], resolve)
  },
  {
    path: 'basice/importPlace',
    name: 'basiceImportPlace',
    component: resolve => require(['./place/ImportPlace'], resolve)
  },
  {
    path: 'basice/student',
    name: 'basiceStudentIndex',
    component: resolve => require(['./student/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/student/list',
    name: 'basiceStudentList',
    component: resolve => require(['./student/List'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/students/detail',
    name: 'basiceStudentDetail',
    component: resolve => require(['./student/Detail'], resolve)
  },
  {
    path: 'basice/course',
    name: 'basiceCourseIndex',
    component: resolve => require(['./course/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/time',
    name: 'teacherTime',
    component: resolve => require(['./teacher/TeacherTime'], resolve)
  },
  {
    path: 'basice/classes',
    name: 'basiceClasses',
    component: resolve => require(['./classes/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/schools',
    name: 'basiceSchools',
    component: resolve => require(['./schools/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/department',
    name: 'basiceDepartment',
    component: resolve => require(['./department/Index'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/manager',
    name: 'basiceManager',
    component: resolve => require(['./department/Mgr'], resolve),
    meta: { keepAlive: true }
  },
  {
    path: 'basice/manager/handover',
    name: 'basiceHandover',
    component: resolve => require(['./department/MgrHandover'], resolve)
  },
  {
    path: 'basice/uncertified',
    name: 'basiceUncertified',
    component: resolve => require(['./uncertified/Index'], resolve)
  },
  {
    path: 'basice/dormitory',
    name: 'basiceDormitory',
    component: resolve => require(['./place/Dormitory'], resolve)
  },
  {
    path: 'basice/dormistoryEdit',
    name: 'basiceDormitoryEdit',
    component: resolve => require(['./place/DormitoryEdit'], resolve)
  },
  {
    path: 'basice/dormitoryCategory',
    name: 'basiceDormitoryCategory',
    component: resolve => require(['./place/DormitoryCategory'], resolve)
  },
  {
    path: 'basice/graduation',
    name: 'basiceGraduation',
    component: resolve => require(['./graduation/Index'], resolve)
  },
  {
    path: 'basice/graduation/list',
    name: 'basiceGraduationYear',
    component: resolve => require(['./graduation/List'], resolve)
  },
  {
    path: 'basice/apply/index',
    name: 'basiceApplyList',
    component: resolve => require(['./apply/Index'], resolve)
  },
  {
    path: 'basice/uncertified/apply',
    name: 'basiceUncertifiedApply',
    component: resolve => require(['./uncertified/Apply'], resolve)
  },
  {
    path: 'basice/course/list',
    name: 'basiceCourse',
    component: resolve => require(['./course/List'], resolve)
  },
  {
    path: 'basice/association/list',
    name: 'basiceAssociation',
    component: resolve => require(['./association/List'], resolve)
  }
]
