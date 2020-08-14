
export default {
  state: {
    physicalTest: {}
  },
  getters: {
    getPhysicalTest(state) {
      return state.physicalTest
    }
  },
  actions: {
    setPhysicalTest({ commit }, physicalTest) {
      commit('savePhysicalTest', physicalTest)
    }
  },
  mutations: {
    savePhysicalTest(state, physicalTest) {
      state.physicalTest = { ...state.physicalTest, ...physicalTest }
    }
  }
}
