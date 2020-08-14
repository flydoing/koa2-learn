export default {
  state: {
    praxis: {}
  },
  getters: {
    getPraxis(state) {
      return state.praxis
    }
  },
  actions: {
    savePraxis({
      commit
    }, praxis) {
      commit('savePraxis', praxis)
    },
    clearPraxis({
      commit
    }) {
      commit('clearPraxis')
    }
  },
  mutations: {
    savePraxis(state, praxis) {
      state.praxis = {
        ...state.praxis,
        ...praxis
      }
    },
    clearPraxis(state) {
      state.praxis = {}
    }
  }
}
