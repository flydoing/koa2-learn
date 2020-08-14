export default {
  state: {
    scrapping: {}
  },
  getters: {
    getScrapping(state) {
      return state.scrapping
    }
  },
  actions: {
    setScrapping({ commit }, scrapping) {
      commit('saveScrapping', scrapping)
    }
  },
  mutations: {
    saveScrapping(state, scrapping) {
      state.scrapping = { ...state.scrapping, ...scrapping }
    }
  }
}
