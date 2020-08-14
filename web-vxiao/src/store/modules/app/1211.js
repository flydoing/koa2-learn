export default {
  state: {
    giveBack: {}
  },
  getters: {
    getGiveBack(state) {
      return state.giveBack
    }
  },
  actions: {
    setGiveBack({ commit }, giveBack) {
      commit('saveGiveBack', giveBack)
    }
  },
  mutations: {
    saveGiveBack(state, giveBack) {
      state.giveBack = { ...state.giveBack, ...giveBack }
    }
  }
}
