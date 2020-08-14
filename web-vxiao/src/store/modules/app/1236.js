export default {
  state: {
    barter: {}
  },
  getters: {
    getBarter(state) {
      return state.barter
    }
  },
  actions: {
    setBarter({ commit }, barter) {
      commit('saveBarter', barter)
    }
  },
  mutations: {
    saveBarter(state, barter) {
      state.barter = { ...state.barter, ...barter }
    }
  }
}
