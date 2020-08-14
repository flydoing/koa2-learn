export default {
  state: {
    doc: {}
  },
  getters: {
    getDocument(state) {
      return state.doc
    }
  },
  actions: {
    setDocument({ commit }, doc) {
      commit('saveDocument', doc)
    },
    deleteDocumentProp({ commit, state }, property) {
      let doc = { ...state.doc }
      delete doc[property]
      commit('updateDocument', doc)
    }
  },
  mutations: {
    saveDocument(state, doc) {
      state.doc = { ...state.doc, ...doc }
    },
    updateDocument(state, doc) {
      state.doc = doc
    }
  }
}
