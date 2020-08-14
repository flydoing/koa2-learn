
export default {
  state: {
    payroll: {}
  },
  getters: {
    getPayroll(state) {
      return state.payroll
    }
  },
  actions: {
    setPayroll({ commit }, payroll) {
      commit('savePayroll', payroll)
    }
  },
  mutations: {
    savePayroll(state, payroll) {
      state.payroll = { ...state.payroll, ...payroll }
    }
  }
}
