export default {
  state: {
    visit: {}
  },
  getters: {
    getHomeVisit(state) {
      return state.visit
    }
  },
  actions: {
    setHomeVisit({ commit }, visit) {
      commit('saveHomeVisit', visit)
    },
    deleteHomeVisitProp({ commit, state }, property) {
      let visit = { ...state.visit }
      delete visit[property]
      commit('updateHomeVisit', visit)
    }
  },
  mutations: {
    saveHomeVisit(state, visit) {
      state.visit = { ...state.visit, ...visit }
    },
    updateHomeVisit(state, visit) {
      state.visit = visit
    }
  }
}
