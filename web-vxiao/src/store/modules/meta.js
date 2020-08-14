import Check from '@/utils/check'
import Api from '@/api/group'
import Vue from 'vue'
export default {
  state: {
    metaDatas: []
  },
  actions: {
    /**
     * 更新元数据
     * @param  {[type]} options.state  [description]
     * @param  {[type]} options.commit [description]
     * @param  {[type]} metaData       [description]
     * @return {[type]}                [description]
     */
    async modifyMetaData({ commit }, metaData) {
      const res = await Api.updateMetaData([metaData])
      return new Promise(resolve => {
        commit('modifyMetaData', metaData)
        resolve(res)
      })
    }
  },
  getters: {
    getMetaDatas(state) {
      return state.metaDatas
    },
    getMetaDataByType: state => (metaType, single = true) => {
      let metas = []
      let meta = {}
      state.metaDatas.some(_meta => {
        if (single && _meta.metaType === metaType) {
          meta = _meta
          return true
        } else {
          _meta.metaType === metaType && metas.push(_meta)
        }
      })
      return single ? meta : metas
    }
  },
  mutations: {
    saveMetaDatas(state, metaDatas) {
      if (Check.isRealArray(metaDatas)) {
        state.metaDatas = [...state.metaDatas, ...metaDatas]
      }
    },
    modifyMetaData(state, metaData) {
      let isExist = false
      state.metaDatas.some((m, i) => {
        if (m.id === metaData.id) {
          Vue.set(state.metaDatas, i, metaData)
          isExist = true
          return isExist
        }
      })
      if (!isExist) {
        state.metaDatas.push(metaData)
      }
    }
  }
}
