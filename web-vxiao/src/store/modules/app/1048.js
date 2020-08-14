export default {
  state: {
    commend: {}
  },
  getters: {
    getCommend(state) {
      return state.commend
    }
  },
  actions: {
    setCommend({ commit }, commend) {
      commit('saveCommend', commend)
    },
    deleteCommendProp({ commit, state }, property) {
      let commend = { ...state.commend }
      delete commend[property]
      commit('updateCommend', commend)
    }
  },
  mutations: {
    saveCommend(state, commend) {
      state.commend = { ...state.commend, ...commend }
    },
    updateCommend(state, commend) {
      state.commend = commend
    }
  }
}
