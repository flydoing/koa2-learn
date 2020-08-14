export default {
  state: {
    publicCourse: {
      template: {
        metaDatas: [{
          obj: '优秀',
          key: 90,
          extension: 1
        }, {
          obj: '中等',
          key: 80,
          extension: 1
        }, {
          obj: '良好',
          key: 70,
          extension: 1
        }, {
          obj: '加油',
          key: 70,
          extension: 0
        }]
      },
      createMain: {}
    }
  },
  getters: {
    getPublicCourseTemplate(state) {
      return state.publicCourse.template
    },
    getPublicCourseCreateMain(state) {
      return state.publicCourse.createMain
    }
  },
  actions: {
    saveTemplate({
      commit
    }, template) {
      commit('saveTemplate', template)
    },
    clearTemplate({
      commit
    }) {
      commit('clearTemplate')
    },
    savePublicCourseCreateMain({
      commit
    }, createMain) {
      commit('savePublicCourseCreateMain', createMain)
    },
    clearPublicCourseCreateMain({
      commit
    }) {
      commit('clearPublicCourseCreateMain')
    }
  },
  mutations: {
    saveTemplate(state, template) {
      state.publicCourse.template = {
        ...state.publicCourse.template,
        ...template
      }
    },
    clearTemplate(state) {
      state.publicCourse.template = {}
    },
    savePublicCourseCreateMain(state, createMain) {
      state.publicCourse.createMain = {
        ...state.publicCourse.createMain,
        ...createMain
      }
    },
    clearPublicCourseCreateMain(state) {
      state.publicCourse.createMain = {}
    }
  }
}
