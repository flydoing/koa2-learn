export default {
  state: {
    solitaire: {}
  },
  getters: {
    getSolitaire(state) {
      return state.solitaire
    }
  },
  actions: {
    setSolitaire({ commit }, solitaire) {
      commit('saveSolitaire', solitaire)
    },
    deleteSolitaireProp({ commit, state }, property) {
      let solitaire = { ...state.solitaire }
      delete solitaire[property]
      commit('updateSolitaire', solitaire)
    }
  },
  mutations: {
    saveSolitaire(state, solitaire) {
      state.solitaire = { ...state.solitaire, ...solitaire }
    },
    updateSolitaire(state, solitaire) {
      state.solitaire = solitaire
    }
  }
}
