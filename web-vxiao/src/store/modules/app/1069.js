export default {
  state: {
    reading: {}
  },
  getters: {
    getReading(state) {
      return state.reading
    }
  },
  actions: {
    saveReading({ commit }, reading) {
      commit('saveReading', reading)
    },
    clearReading({ commit }) {
      commit('clearReading')
    }
  },
  mutations: {
    saveReading(state, reading) {
      state.reading = {
        ...state.reading,
        ...reading
      }
    },
    clearReading(state) {
      state.reading = {}
    }
  }
}
