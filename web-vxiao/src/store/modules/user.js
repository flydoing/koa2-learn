import Api from '@/api/user'
export default {
  state: {
    user: {},
    userDetail: {},
    userTypes: []
  },
  getters: {
    getSigninUser(state) { return state.user || {} },
    getUserDetail(state) { return state.userDetail || {} },
    getUserTypes(state) { return state.userTypes || [] }
  },
  actions: {
    /**
     * 修改登录用户（头像，名称等）
     * @param  {[type]} options.commit [description]
     * @param  {[type]} user           [description]
     * @return {[type]}                [description]
     */
    modifyLoginUser({ commit }, user) {
      commit('modifyLoginUser', user)
    },
    async getUserDetail({ commit }) {
      const detail = await Api.getUserDetail()
      if (detail) {
        commit('saveUserDetail', detail.user)
      }
    },
    async getUserTypes({ commit, rootState }) {
      const types = await Api.getUserTypes(rootState.USERID)
      if (types) {
        commit('saveUserTypes', types.userTypes || [])
      }
    }
  },
  mutations: {
    saveUser(state, userInfo) {
      state.user = userInfo
    },
    modifyLoginUser(state, user) {
      state.user = { ...state.user, ...user }
    },
    saveUserDetail(state, userDetail) {
      state.userDetail = { ...state.userDetail, ...userDetail }
    },
    saveUserTypes(state, types) {
      state.userTypes = types
    }
  }
}
