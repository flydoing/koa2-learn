
export default {
  state: {
    attendance: {}
  },
  getters: {
    getAttendance(state) {
      return state.attendance
    }
  },
  actions: {
    setAttendance({ commit }, attendance) {
      commit('saveAttendance', attendance)
    }
  },
  mutations: {
    saveAttendance(state, attendance) {
      state.attendance = { ...state.attendance, ...attendance }
    }
  }
}
