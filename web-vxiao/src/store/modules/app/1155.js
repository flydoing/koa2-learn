
export default {
  state: {
    physicalExam: {}
  },
  getters: {
    getPhysicalExam(state) {
      return state.physicalExam
    }
  },
  actions: {
    setPhysicalExam({ commit }, physicalExam) {
      commit('savePhysicalExam', physicalExam)
    }
  },
  mutations: {
    savePhysicalExam(state, physicalExam) {
      state.physicalExam = { ...state.physicalExam, ...physicalExam }
    }
  }
}
