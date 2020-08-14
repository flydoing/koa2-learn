import G from '@/views/group/mixin'
export default {
  mixins: [G],
  components: {
    CommonPraxis: resolve => require(['@/views/business/1047/detail/CommonPraxis'], resolve),
    Titleview: resolve => require(['@/views/business/1047/detail/TitleView'], resolve),
    AnalysisEnter: resolve => require(['@/views/business/1047/detail/AnalysisEnter'], resolve),
    OptionView: resolve => require(['@/views/business/1047/detail/OptionView'], resolve),
    StudentOptionsView: resolve => require(['@/views/business/1047/detail/StudentOptionsView'], resolve)
  },
  methods: {
    getPraxiStyle(type) {
      switch (type) {
        case '6':
          return 'Single'
        case '7':
          return 'Double'
        case '8':
          return 'AnswerQuestions'
        case '9':
          return 'FillOld'
        case '12':
          return 'Fill'
        case '13':
          return 'Sorting'
        case '14':
          return 'Judge'
        case '15':
          return 'Compose'
        case '16':
          return 'Matching'
        case '17':
          return 'TextSort'
      }
    },
    getSerial(i) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i)
    },
    showAnalyEnter() {
      // 当用户是老师身份 或者 非老师身份 并且 界面类型未 学生查看答卷（studentReview）显示查看解析入口
      return ((this.isTeacher) || (!this.isTeacher && this.routeQuery('pageType') === 'studentReview'))
    },
    showAcountBar() {
      // 不是解析界面 并且 题型不为综合题 并且是老师身份 则展示已答人数
      return !this.isAnaly && !this.isCompose && this.isTeacher && this.isFromPraxis
    }
  }
}
