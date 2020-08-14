export default {
  state: {
    meeting: {}
  },
  getters: {
    getMeeting(state) {
      return state.meeting
    }
  },
  actions: {
    setMeeting({ commit }, meeting) {
      commit('saveMeeting', meeting)
    },
    deleteMeetingProp({ commit, state }, property) {
      let meeting = { ...state.meeting }
      delete meeting[property]
      commit('updateMeeting', meeting)
    }
  },
  mutations: {
    saveMeeting(state, meeting) {
      state.meeting = { ...state.meeting, ...meeting }
    },
    updateMeeting(state, meeting) {
      state.meeting = meeting
    }
  }
}
