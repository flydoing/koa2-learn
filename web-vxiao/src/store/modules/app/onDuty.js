export default {
  state: {
    onDuty: {}
  },
  getters: {
    getOnDuty(state) {
      return state.onDuty
    }
  },
  actions: {
    setOnDuty({ commit }, onDuty) {
      commit('saveOnDuty', onDuty)
    },
    deleteOnDutyProp({ commit, state }, property) {
      let onDuty = { ...state.onDuty }
      delete onDuty[property]
      commit('updateOnDuty', onDuty)
    }
  },
  mutations: {
    saveOnDuty(state, onDuty) {
      state.onDuty = { ...state.onDuty, ...onDuty }
    },
    updateOnDuty(state, onDuty) {
      state.visit = onDuty
    }
  }
}
