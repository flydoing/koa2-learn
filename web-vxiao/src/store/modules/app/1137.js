export default {
  state: {
    countdown: {}
  },
  getters: {
    getCountdown(state) {
      return state.countdown
    }
  },
  actions: {
    setCountdown({ commit }, countdown) {
      commit('saveCountdown', countdown)
    }
  },
  mutations: {
    saveCountdown(state, countdown) {
      state.countdown = { ...state.countdown, ...countdown }
    }
  }
}
