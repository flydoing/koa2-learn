export default {
  state: {
    modelEssay: {
      essayCreate: {}
    }
  },
  getters: {
    getEssayCreate(state) {
      return state.modelEssay.essayCreate
    }
  },
  actions: {
    saveEssayCreate({
      commit
    }, essayCreate) {
      commit('saveEssayCreate', essayCreate)
    },
    clearEssayCreate({
      commit
    }) {
      commit('clearEssayCreate')
    }
  },
  mutations: {
    saveEssayCreate(state, essayCreate) {
      state.modelEssay.essayCreate = {
        ...state.modelEssay.essayCreate,
        ...essayCreate
      }
    },
    clearEssayCreate(state) {
      state.modelEssay.essayCreate = {}
    }
  }
}
