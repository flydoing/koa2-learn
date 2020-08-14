export default {
  state: {
    appraisal: {}
  },
  getters: {
    getTeacherAppraisal(state) {
      return state.appraisal
    }
  },
  actions: {
    setTeacherAppraisal({ commit }, appraisal) {
      commit('saveTeacherAppraisal', appraisal)
    }
  },
  mutations: {
    saveTeacherAppraisal(state, appraisal) {
      state.appraisal = { ...state.appraisal, ...appraisal }
    }
  }
}
