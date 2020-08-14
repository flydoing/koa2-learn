export default {
  state: {
    appraisal: {}
  },
  getters: {
    getSubjectAppraisal(state) {
      return state.appraisal
    }
  },
  actions: {
    setSubjectAppraisal({ commit }, appraisal) {
      commit('saveSubjectAppraisal', appraisal)
    }
  },
  mutations: {
    saveSubjectAppraisal(state, appraisal) {
      state.appraisal = { ...state.appraisal, ...appraisal }
    }
  }
}
