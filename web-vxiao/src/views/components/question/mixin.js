export default {
  components: {
    Single: resolve => require(['./Single'], resolve),
    Judge: resolve => require(['./Single'], resolve),
    Multiple: resolve => require(['./Multiple'], resolve),
    Fill: resolve => require(['./Fill'], resolve)
  },
  methods: {
    getType(value) {
      switch (value) {
        case '6':
          return 'Single'
        case '7':
          return 'Multiple'
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
    }
  }
}
