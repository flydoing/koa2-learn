export default {
  state: {
    rating: {}
  },
  getters: {
    getRating(state) {
      return state.rating
    }
  },
  actions: {
    setRating({ commit }, rating) {
      commit('saveRating', rating)
    },
    deleteRatingProp({ commit, state }, property) {
      let rating = { ...state.rating }
      delete rating[property]
      commit('updateRating', rating)
    }
  },
  mutations: {
    saveRating(state, rating) {
      state.rating = { ...state.rating, ...rating }
    },
    updateRating(state, rating) {
      state.rating = rating
    }
  }
}
