export default {
  state: {
    borrowMoney: {}
  },
  getters: {
    getBorrowMoney(state) {
      return state.borrowMoney
    }
  },
  actions: {
    setBorrowMoney({ commit }, borrowMoney) {
      commit('saveBorrowMoney', borrowMoney)
    }
  },
  mutations: {
    saveBorrowMoney(state, borrowMoney) {
      state.borrowMoney = { ...state.borrowMoney, ...borrowMoney }
    }
  }
}
