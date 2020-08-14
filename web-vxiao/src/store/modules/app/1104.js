export default {
  state: {
    shipments: {}
  },
  getters: {
    getShipments(state) {
      return state.shipments
    }
  },
  actions: {
    setShipments({ commit }, shipments) {
      commit('saveShipments', shipments)
    }
  },
  mutations: {
    saveShipments(state, shipments) {
      state.shipments = { ...state.shipments, ...shipments }
    }
  }
}
