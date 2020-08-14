
export default {
  state: {
    evaluate: {}
  },
  getters: {
    getCourseEvaluate(state) {
      return state.evaluate
    }
  },
  actions: {
    setCourseEvaluate({ commit }, evaluate) {
      commit('saveCourseEvaluate', evaluate)
    }
  },
  mutations: {
    saveCourseEvaluate(state, evaluate) {
      state.evaluate = { ...state.evaluate, ...evaluate }
    }
  }
}
