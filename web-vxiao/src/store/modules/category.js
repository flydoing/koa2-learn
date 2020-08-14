import Rest from '@/api/category'

export default {
  state: {
    categoryMap: {}
  },
  mutations: {
    addCategory(state, { type, groupId, categorys }) {
      let key = [type]
      groupId && key.push(groupId)
      key = key.join('_')
      state.categoryMap[key] = categorys
    }
  },
  actions: {
    async getCategorys(commit, { type, groupId }) {
      const { data } = await Rest.getCategorys({ type, groupId })
      if (data && data.categorys) {
        commit('addCategory', { type, groupId, categorys: data.categorys })
        return data.categorys
      }
    }
  }
}
