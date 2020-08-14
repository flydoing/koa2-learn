
export default {
  state: {
    security: {}
  },
  getters: {
    getSecurity(state) {
      return state.security
    }
  },
  actions: {
    setSecurity({ commit }, security) {
      commit('saveSecurity', security)
    }
  },
  mutations: {
    saveSecurity(state, security) {
      state.security = { ...state.security, ...security }
    }
  }
}
