
export default {
  state: {
    expense: {}
  },
  getters: {
    getExpense(state) {
      return state.expense
    }
  },
  actions: {
    setExpense({ commit }, expense) {
      commit('saveExpense', expense)
    }
  },
  mutations: {
    saveExpense(state, expense) {
      state.expense = { ...state.expense, ...expense }
    }
  }
}
