export default {
  state: {
    mien: {}
  },
  getters: {
    getTeacherMien(state) {
      return state.mien
    }
  },
  actions: {
    setTeacherMien({ commit }, mien) {
      commit('saveTeacherMien', mien)
    },
    deleteTeacherMienProp({ commit, state }, property) {
      let mien = { ...state.mien }
      delete mien[property]
      commit('updateTeacherMien', mien)
    }
  },
  mutations: {
    saveTeacherMien(state, mien) {
      state.mien = { ...state.mien, ...mien }
    },
    updateTeacherMien(state, mien) {
      state.mien = mien
    }
  }
}
