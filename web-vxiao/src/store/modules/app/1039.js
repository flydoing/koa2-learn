export default {
  state: {
    order: {}
  },
  getters: {
    getOrder(state) {
      return state.order
    }
  },
  actions: {
    setOrder({ commit }, order) {
      commit('saveOrder', order)
    },
    deleteOrderProp({ commit, state }, property) {
      let order = { ...state.order }
      delete order[property]
      commit('updateOrder', order)
    }
  },
  mutations: {
    saveOrder(state, order) {
      state.order = { ...state.order, ...order }
    },
    updateOrder(state, order) {
      state.order = order
    }
  }
}
