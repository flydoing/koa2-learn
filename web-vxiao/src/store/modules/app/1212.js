
export default {
  state: {
    placeReserve: {}
  },
  getters: {
    getPlaceReserve(state) {
      return state.placeReserve
    }
  },
  actions: {
    setPlaceReserve({ commit }, placeReserve) {
      commit('savePlaceReserve', placeReserve)
    }
  },
  mutations: {
    savePlaceReserve(state, placeReserve) {
      state.placeReserve = { ...state.placeReserve, ...placeReserve }
    }
  }
}
