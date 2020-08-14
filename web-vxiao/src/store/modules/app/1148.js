
export default {
  state: {
    handover: {}
  },
  getters: {
    getHandover(state) {
      return state.handover
    }
  },
  actions: {
    setHandover({ commit }, handover) {
      commit('saveHandover', handover)
    }
  },
  mutations: {
    saveHandover(state, handover) {
      state.handover = { ...state.handover, ...handover }
    }
  }
}
