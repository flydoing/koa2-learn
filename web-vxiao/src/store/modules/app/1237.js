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
    },
    deleteAttendanceProp({ commit, state }, property) {
      let attendance = { ...state.attendance }
      delete attendance[property]
      commit('updateAttendance', attendance)
    }
  },
  mutations: {
    saveAttendance(state, attendance) {
      state.attendance = { ...state.attendance, ...attendance }
    },
    updateAttendance(state, attendance) {
      state.attendance = attendance
    }
  }
}
