
export default {
  state: {
    panomara: {}
  },
  getters: {
    getPanomara(state) {
      return state.panomara
    }
  },
  actions: {
    setPanomara({ commit }, panomara) {
      commit('savePanomara', panomara)
    }
  },
  mutations: {
    savePanomara(state, panomara) {
      state.panomara = { ...state.panomara, ...panomara }
    }
  }
}
