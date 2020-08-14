export default {
  state: {
    cookbook: {
      cookCreate: {}
    }
  },
  getters: {
    getCookCreate(state) {
      return state.cookbook.cookCreate
    }
  },
  actions: {
    saveCookCreate({
      commit
    }, cookCreate) {
      commit('saveCookCreate', cookCreate)
    },
    clearCookCreate({
      commit
    }) {
      commit('clearCookCreate')
    }
  },
  mutations: {
    saveCookCreate(state, cookCreate) {
      state.cookbook.cookCreate = {
        ...state.cookbook.cookCreate,
        ...cookCreate
      }
    },
    clearCookCreate(state) {
      state.cookbook.cookCreate = {}
    }
  }
}
