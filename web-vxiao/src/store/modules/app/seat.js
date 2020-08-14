export default {
  state: {
    seatTable: {}
  },
  getters: {
    getSeatTable(state) {
      return state.seatTable
    }
  },
  actions: {
    setSeatTable({ commit }, seatTable) {
      commit('saveSeatTable', seatTable)
    }
  },
  mutations: {
    saveSeatTable(state, seatTable) {
      state.seatTable = { ...state.seatTable, ...seatTable }
    }
  }
}
