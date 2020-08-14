export default {
  state: {
    onDuty: {}
  },
  getters: {
    getOnDuty(state) {
      return state.onDuty
    }
  },
  actions: {
    setOnDuty({ commit }, onDuty) {
      commit('saveOnDuty', onDuty)
    }
  },
  mutations: {
    saveOnDuty(state, onDuty) {
      state.onDuty = { ...state.onDuty, ...onDuty }
    }
  }
}
