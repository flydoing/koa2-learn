export default {
  state: {
    leave: {}
  },
  getters: {
    getLeave(state) {
      return state.leave
    }
  },
  actions: {
    setLeave({ commit }, leave) {
      commit('saveLeave', leave)
    },
    deleteLeaveProp({ commit, state }, property) {
      let leave = { ...state.leave }
      delete leave[property]
      commit('updateLeave', leave)
    }
  },
  mutations: {
    saveLeave(state, leave) {
      state.leave = { ...state.leave, ...leave }
    },
    updateLeave(state, leave) {
      state.leave = leave
    }
  }
}
