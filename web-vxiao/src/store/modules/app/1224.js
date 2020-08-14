export default {
  state: {
    storage: {}
  },
  getters: {
    getStorage(state) {
      return state.storage
    }
  },
  actions: {
    setStorage({ commit }, storage) {
      commit('saveStorage', storage)
    }
  },
  mutations: {
    saveStorage(state, storage) {
      state.storage = { ...state.storage, ...storage }
    }
  }
}
