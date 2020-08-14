export default {
  state: {
    exam: {
      settings: [],
      createInfo: {
        datas: {}
      }
    }
  },
  getters: {
    getExam(state) {
      return state.exam
    },
    getSettings(state) {
      return state.exam.settings
    },
    getCreateInfo(state) {
      return state.exam.createInfo
    }
  },
  actions: {
    setExam({ commit }, exam) {
      commit('saveExam', exam)
    },
    saveSettings({ commit }, settings) {
      commit('saveSettings', settings)
    },
    clearSettings({ commit }) {
      commit('clearSettings')
    },
    saveCreateInfo({ commit }, infos) {
      commit('saveCreateInfo', infos)
    },
    clearCreateInfo({ commit }) {
      commit('clearCreateInfo')
    },
    deleteExamProp({ commit, state }, property) {
      let exam = { ...state.exam }
      delete exam[property]
      commit('updateExam', exam)
    }
  },
  mutations: {
    saveExam(state, exam) {
      state.exam = { ...state.exam, ...exam }
    },
    saveSettings(state, settings) {
      state.exam.settings = [...settings]
    },
    clearSettings(state) {
      state.exam.settings = []
    },
    saveCreateInfo(state, infos) {
      state.exam.createInfo = {
        ...state.exam.createInfo,
        ...infos
      }
    },
    clearCreateInfo(state) {
      state.exam.createInfo = {
        datas: {}
      }
    },
    updateExam(state, exam) {
      state.exam = exam
    }
  }
}
