export default {
  state: {
    crm: {}
  },
  getters: {
    getCrm(state) {
      return state.crm
    }
  },
  actions: {
    setCrm({ commit }, crm) {
      commit('saveCrm', crm)
    },
    deleteCrmProp({ commit, state }, property) {
      let crm = { ...state.crm }
      delete crm[property]
      commit('updateCrm', crm)
    }
  },
  mutations: {
    saveCrm(state, crm) {
      state.crm = { ...state.crm, ...crm }
    },
    updateCrm(state, crm) {
      state.crm = crm
    }
  }
}
