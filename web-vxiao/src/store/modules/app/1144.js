export default {
  state: {
    classMedal: {}
  },
  getters: {
    getClassMedal(state) {
      return state.classMedal
    }
  },
  actions: {
    setClassMedal({ commit }, classMedal) {
      commit('saveClassMedal', classMedal)
    }
  },
  mutations: {
    saveClassMedal(state, classMedal) {
      state.classMedal = { ...state.classMedal, ...classMedal }
    }
  }
}
