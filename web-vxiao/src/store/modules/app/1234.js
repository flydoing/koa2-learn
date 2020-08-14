export default {
  state: {
    exchange: {}
  },
  getters: {
    getExchangeCourse(state) {
      return state.exchange
    }
  },
  actions: {
    setExchangeCourse({ commit }, exchange) {
      commit('saveExchangeCourse', exchange)
    },
    deleteExchangeCourseProp({ commit, state }, property) {
      let exchange = { ...state.exchange }
      delete exchange[property]
      commit('updateExchangeCourse', exchange)
    }
  },
  mutations: {
    saveExchangeCourse(state, exchange) {
      state.exchange = { ...state.exchange, ...exchange }
    },
    updateExchangeCourse(state, exchange) {
      state.exchange = exchange
    }
  }
}
