export default {
  state: {
    procurement: {}
  },
  getters: {
    getProcurement(state) {
      return state.procurement
    }
  },
  actions: {
    setProcurement({ commit }, procurement) {
      commit('saveProcurement', procurement)
    }
  },
  mutations: {
    saveProcurement(state, procurement) {
      state.procurement = { ...state.procurement, ...procurement }
    }
  }
}
