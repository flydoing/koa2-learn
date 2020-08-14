
export default {
  state: {
    selection: {}
  },
  getters: {
    getSelection(state) {
      return state.selection
    }
  },
  actions: {
    setSelection({ commit }, selection) {
      commit('saveSelection', selection)
    }
  },
  mutations: {
    saveSelection(state, selection) {
      state.selection = { ...state.selection, ...selection }
    }
  }
}
