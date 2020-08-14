export default {
  state: {
    chant: {
      chantPush: {
        pushCycle: [],
        cacheGrade: []
      }
    }
  },
  getters: {
    getChant(state) {
      return state.chant
    },
    getChantPush(state) {
      return state.chant.chantPush
    }
  },
  actions: {
    setChant({ commit }, chant) {
      commit('saveChant', chant)
    },
    saveChantPush({ commit }, chantPush) {
      commit('saveChantPush', chantPush)
    },
    deleteChantProp({ commit, state }, property) {
      let chant = { ...state.chant }
      delete chant[property]
      commit('updateChant', chant)
    }
  },
  mutations: {
    saveChant(state, chant) {
      state.chant = { ...state.chant, ...chant }
    },
    saveChantPush(state, chantPush) {
      state.chant.chantPush = { ...state.chant.chantPush, ...chantPush }
    },
    updateChant(state, chant) {
      state.chant = chant
    }
  }
}
