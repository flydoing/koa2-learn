
export default {
  state: {
    visitor: {}
  },
  getters: {
    getVisitor(state) {
      return state.visitor
    }
  },
  actions: {
    setVisitor({ commit }, visitor) {
      commit('saveVisitor', visitor)
    },
    deleteVisitorProp({ commit, state }, property) {
      let visitor = { ...state.visitor }
      delete visitor[property]
      commit('updateVisitor', visitor)
    }
  },
  mutations: {
    saveVisitor(state, visitor) {
      state.visitor = { ...state.visitor, ...visitor }
    },
    updateVisitor(state, visitor) {
      state.visitor = visitor
    }
  }
}
