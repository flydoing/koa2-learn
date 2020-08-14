export default {
  state: {
    punchClock: {}
  },
  getters: {
    getPunchClock(state) {
      return state.punchClock
    }
  },
  actions: {
    setPunchClock({ commit }, punchClock) {
      commit('savePunchClock', punchClock)
    },
    deletePunchClockProp({ commit, state }, property) {
      let punchClock = { ...state.punchClock }
      delete punchClock[property]
      commit('updatePunchClock', punchClock)
    }
  },
  mutations: {
    savePunchClock(state, punchClock) {
      state.punchClock = { ...state.punchClock, ...punchClock }
    },
    updatePunchClock(state, punchClock) {
      state.punchClock = punchClock
    }
  }
}
