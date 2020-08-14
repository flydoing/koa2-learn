export default {
  state: {
    journal: {}
  },
  getters: {
    getJournal(state) {
      return state.journal
    }
  },
  actions: {
    setJournal({ commit }, journal) {
      commit('saveJournal', journal)
    }
  },
  mutations: {
    saveJournal(state, journal) {
      state.journal = { ...state.journal, ...journal }
    }
  }
}
