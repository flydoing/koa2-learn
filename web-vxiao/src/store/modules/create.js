import Vue from 'vue'

export default {
  state: {
    createObject: {}
  },
  getters: {
    getCreateObject(state) {
      return state.createObject
    }
  },
  actions: {
    setCreateObject({ commit }, object) {
      commit('saveCreateObject', object)
    },
    modifyCreateObject({ commit }, object) {
      commit('modifyCreateObject', object)
    },
    modifyCreateObjectField({ commit }, field, object) {
      commit('modifyCreateObjectField', { field, object })
    }
  },
  mutations: {
    saveCreateObject(state, object) {
      state.createObject = { ...state.createObject, ...object }
    },
    modifyCreateObject(state, object) {
      state.object = object
    },
    modifyCreateObjectField(state, { field, object }) {
      if (object === null || object === undefined) {
        Vue.delete(state.createObject, field)
      } else {
        Vue.set(state.createObject, field, object)
      }
    }
  }
}
