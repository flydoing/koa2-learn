export default {
  state: {
    arrange: {}
  },
  getters: {
    getArrangeExam(state) {
      return state.arrange
    }
  },
  actions: {
    setArrangeExam({ commit }, arrange) {
      commit('saveArrangeExam', arrange)
    },
    deleteArrangeExamProp({ commit, state }, property) {
      let arrange = { ...state.arrange }
      delete arrange[property]
      commit('updateArrangeExam', arrange)
    }
  },
  mutations: {
    saveArrangeExam(state, arrange) {
      state.arrange = { ...state.arrange, ...arrange }
    },
    updateArrangeExam(state, arrange) {
      state.arrange = arrange
    }
  }
}
