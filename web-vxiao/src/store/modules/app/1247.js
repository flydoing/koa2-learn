export default {
  state: {
    contentManage: {}
  },
  getters: {
    getContentManage(state) {
      return state.contentManage
    }
  },
  actions: {
    saveContentManage({ commit }, contents) {
      commit('saveContentManage', contents)
    },
    clearContentManage({ commit }) {
      commit('clearContentManage')
    }
  },
  mutations: {
    saveContentManage(state, contents) {
      state.contentManage = {
        ...state.contentManage,
        ...contents
      }
    },
    clearContentManage(state) {
      state.contentManage = {}
    }
  }
}
