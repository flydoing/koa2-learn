
export default {
  state: {
    appraisal: {}
  },
  getters: {
    getStudentAppraisal(state) {
      return state.appraisal
    }
  },
  actions: {
    setStudentAppraisal({ commit }, appraisal) {
      commit('saveStudentAppraisal', appraisal)
    }
  },
  mutations: {
    saveStudentAppraisal(state, appraisal) {
      state.appraisal = { ...state.appraisal, ...appraisal }
    }
  }
}
