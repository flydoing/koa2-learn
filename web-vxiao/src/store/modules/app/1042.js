export default {
  state: {
    questionaire: {}
  },
  getters: {
    getQuestionaire(state) {
      return state.questionaire
    }
  },
  actions: {
    setQuestionaire({ commit }, questionaire) {
      commit('saveQuestionaire', questionaire)
    },
    deleteQuestionaireProp({ commit, state }, property) {
      let questionaire = { ...state.questionaire }
      delete questionaire[property]
      commit('updateQuestionaire', questionaire)
    }
  },
  mutations: {
    saveQuestionaire(state, questionaire) {
      state.questionaire = { ...state.questionaire, ...questionaire }
    },
    updateQuestionaire(state, questionaire) {
      state.questionaire = questionaire
    }
  }
}
