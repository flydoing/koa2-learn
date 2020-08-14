
export default {
  state: {
    inspection: {}
  },
  getters: {
    getInspection(state) {
      return state.inspection
    }
  },
  actions: {
    setInspection({ commit }, inspection) {
      commit('saveInspection', inspection)
    }
  },
  mutations: {
    saveInspection(state, inspection) {
      state.inspection = { ...state.inspection, ...inspection }
    }
  }
}
