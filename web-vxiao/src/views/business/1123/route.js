export default [
  {
    path: '1123/examinationCreate',
    component: resolve => require(['./AppCreate'], resolve),
    name: 'examinationCreate',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1123/examinationShowSetting',
    component: resolve => require(['./ShowSetting'], resolve),
    name: 'examinationShowSetting',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1123/examinationLadderList',
    component: resolve => require(['./LadderList'], resolve),
    name: 'examinationLadderList'
  },
  {
    path: '1123/examinationLadderDetail',
    component: resolve => require(['./LadderDetail'], resolve),
    name: 'examinationLadderDetail'
  },
  {
    path: '1123/detail',
    component: resolve => require(['./detail/Index'], resolve),
    name: 'detail1123'
  },
  {
    path: '1123/examClassCardLineChart',
    component: resolve => require(['./detail/ClassChartLine'], resolve),
    name: 'examClassCardLineChart1123'
  },
  {
    path: '1123/examClassPersonal',
    component: resolve => require(['./detail/ClassPersonal'], resolve),
    name: 'examClassPersonal1123'
  },
  {
    path: '1123/examSchoolDetailIndex',
    component: resolve => require(['./detail/SchoolDetailIndex'], resolve),
    name: 'examSchoolDetailIndex1123'
  },
  {
    path: '1123/examSchoolCardLineChart',
    component: resolve => require(['./detail/SchoolChartLine'], resolve),
    name: 'examSchoolCardLineChart1123'
  },
  {
    path: '1123/settingDetail',
    component: resolve => require(['./setup/Detail'], resolve),
    name: 'settingDetail1123'
  },
  {
    path: '1123/selectSubject',
    component: resolve => require(['./setup/SelectSubject'], resolve),
    name: 'selectSubject1123'
  },
  {
    path: '1123/selectCategory',
    component: resolve => require(['./setup/SelectCategory'], resolve),
    name: 'selectCategory1123'
  },
  {
    path: '1123/scoreSection',
    component: resolve => require(['./setup/ScoreSection'], resolve),
    name: 'scoreSection1123'
  },
  {
    path: '1123/levelEdit',
    component: resolve => require(['./setup/LevelEdit'], resolve),
    name: 'levelEdit1123'
  },
  {
    path: '1123/examTablesEdit',
    component: resolve => require(['./ExamTablesEdit'], resolve),
    name: 'examTablesEdit1123'
  },
  {
    path: '1123/report/:groupId',
    component: resolve => require(['./Report'], resolve),
    name: 'report1123',
    meta: { keepAlive: true }
  },
  {
    path: '1123/resultsShow',
    component: resolve => require(['./ResultsShow'], resolve),
    name: 'resultsShow1123'
  },
  {
    path: '1123/errorView',
    component: resolve => require(['./ErrorView'], resolve),
    name: 'errorView1123'
  },
  {
    path: '1123/classList',
    component: resolve => require(['./ClassList'], resolve),
    name: 'classList1123'
  }
]
