
export default {
  state: {
    vscreen: {}
  },
  getters: {
    getVscreen(state) {
      return state.vscreen
    }
  },
  actions: {
    setVscreen({ commit }, vscreen) {
      commit('saveVscreen', vscreen)
    }
  },
  mutations: {
    saveVscreen(state, vscreen) {
      state.vscreen = { ...state.vscreen, ...vscreen }
    }
  }
}
