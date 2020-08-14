export default {
  state: {
    mien: {},
    selectedList: []
  },
  getters: {
    getStudentMien(state) {
      return state.mien
    },
    getSelectedList(state) {
      return state.selectedList
    }
  },
  actions: {
    saveSelectedList({ commit }, personList) {
      commit('saveSelectedList', personList)
    },
    setStudentMien({ commit }, mien) {
      commit('saveStudentMien', mien)
    },
    clearSelectedList({ commit }) {
      commit('clearSelectedList')
    }
  },
  mutations: {
    saveStudentMien(state, mien) {
      state.mien = { ...state.mien, ...mien }
    },
    saveSelectedList(state, personList) {
      state.selectedList = personList
    },
    clearSelectedList(state) {
      state.selectedList = []
    }
  }
}
