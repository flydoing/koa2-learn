/**
 * 排考公用路由
 */
export default [
  { path: '1164/childCardList', name: 'childCardList1164', component: resolve => require(['./ChildCardList'], resolve) },
  { path: '1164/importView', name: 'importView1164', component: resolve => require(['./ImportView'], resolve) },
  { path: '1164/normalArrange/create', name: 'normalArrange1164', component: resolve => require(['./normalArrange/Create'], resolve) },
  { path: '1164/summaryArrange/create', name: 'summaryArrange1164', component: resolve => require(['./summaryArrange/Create'], resolve) },
  { path: '1164/intelligentArrange/timeStep', name: 'timeStep1164', component: resolve => require(['./intelligentArrange/TimeStep'], resolve) },
  { path: '1164/intelligentArrange/placeStep', name: 'placeStep1164', component: resolve => require(['./intelligentArrange/PlaceStep'], resolve) },
  { path: '1164/intelligentArrange/invigilateStep', name: 'invigilateStep1164', component: resolve => require(['./intelligentArrange/InvigilateStep'], resolve) },
  { path: '1164/intelligentArrange/autoStep', name: 'autoStep1164', component: resolve => require(['./intelligentArrange/AutoStep'], resolve) },
  { path: '1164/intelligentArrange/selectGrade', component: resolve => require(['./intelligentArrange/SelectGrade'], resolve) },
  { path: '1164/intelligentArrange/selectClass', component: resolve => require(['./intelligentArrange/SelectClass'], resolve) },
  { path: '1164/intelligentArrange/selectSubject', component: resolve => require(['./intelligentArrange/SelectSubject'], resolve) },
  { path: '1164/intelligentArrange/memberList', name: 'memberList1164', component: resolve => require(['./intelligentArrange/MemberList'], resolve) },
  { path: '1164/intelligentArrange/selectGroup', name: 'selectGroup1164', component: resolve => require(['./intelligentArrange/SelectGroup'], resolve) },
  { path: '1164/intelligentArrange/selectMember', name: 'selectMember1164', component: resolve => require(['./intelligentArrange/SelectMember'], resolve) },
  { path: '1164/intelligentArrange/seatPreview', name: 'seatPreview1164', component: resolve => require(['./intelligentArrange/SeatPreview'], resolve) },
  { path: '1164/intelligentArrange/subjectPreview', name: 'subjectPreview1164', component: resolve => require(['./intelligentArrange/SubjectPreview'], resolve) },
  { path: '1164/seatArrange/create', name: 'seatArrange1164', component: resolve => require(['./seatArrange/Create'], resolve) },
  { path: '1164/seatArrange/selectGrade', name: 'selectGrade1164', component: resolve => require(['./seatArrange/SelectGrade'], resolve) },
  { path: '1164/seatArrange/selectSubject', name: 'selectSubject1164', component: resolve => require(['./seatArrange/SelectSubject'], resolve) },
  { path: '1164/seatArrange/importView', name: 'importSeatView1164', component: resolve => require(['./seatArrange/ImportView'], resolve) },
  { path: '1164/seatArrange/gradeInfo', name: 'gradeInfo1164', component: resolve => require(['./seatArrange/GradeInfo'], resolve) },
  { path: '1164/examPlaceArrange/create', name: 'examPlaceArrange1164', component: resolve => require(['./examPlaceArrange/Create'], resolve) }
]
