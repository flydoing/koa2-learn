
export default {
  state: {
    prize: {}
  },
  getters: {
    getPrize(state) {
      return state.prize
    }
  },
  actions: {
    setPrize({ commit }, prize) {
      commit('savePrize', prize)
    }
  },
  mutations: {
    savePrize(state, prize) {
      state.prize = { ...state.prize, ...prize }
    }
  }
}
