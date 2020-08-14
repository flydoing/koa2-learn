export default {
  state: {
    summary: {}
  },
  getters: {
    getApslSummary(state) {
      return state.summary
    }
  },
  actions: {
    setApslSummary({ commit }, summary) {
      commit('saveApslSummary', summary)
    }
  },
  mutations: {
    saveApslSummary(state, summary) {
      state.summary = { ...state.summary, ...summary }
    }
  }
}
