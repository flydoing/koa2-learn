
export default {
  state: {
    appraisal: {}
  },
  getters: {
    getSuperviseAppraisal(state) {
      return state.appraisal
    }
  },
  actions: {
    setSuperviseAppraisal({ commit }, appraisal) {
      commit('saveSuperviseAppraisal', appraisal)
    }
  },
  mutations: {
    saveSuperviseAppraisal(state, appraisal) {
      state.appraisal = { ...state.appraisal, ...appraisal }
    }
  }
}
