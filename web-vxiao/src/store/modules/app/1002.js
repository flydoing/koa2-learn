export default {
  state: {
    homework: {}
  },
  getters: {
    getHomework(state) {
      return state.homework
    }
  },
  actions: {
    saveHomework({
      commit
    }, homework) {
      commit('saveHomework', homework)
    },
    clearHomework({
      commit
    }) {
      commit('clearHomework')
    }
  },
  mutations: {
    saveHomework(state, homework) {
      state.homework = {
        ...state.homework,
        ...homework
      }
    },
    clearHomework(state) {
      state.homework = {}
    }
  }
}
