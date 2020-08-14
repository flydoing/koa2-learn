import Api from '@/api/group'
import Check from '@/utils/check'
import Vue from 'vue'
/**
 * 基础应用store结构
 */
export default {
  state: {
    apps: {},
    groupRelations: {},
    appsInfo: {},
    app: false,
    handleBack: '' // 区分：点击后退回上一页、新建成功后回到首页
  },
  getters: {
    getHandldeBack(state) {
      return state.handleBack
    },
    /**
     * 当前活动群
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    getCurrentApp(state) {
      return state.app
    },
    /**
     * 根据类型查找app
     * @param  {[type]} state   [description]
     * @return {[type]}         [description]
     */
    getAppByType: state => (type, groupId) => {
      let app = state.apps[type]
      if (app && groupId) {
        let relations = state.groupRelations[groupId]
        if (relations) {
          let relation =
            relations.filter(r => {
              return r.type === type
            })[0] || {}
          return {
            relation: relation,
            ...app,
            name: relation.name || app.name
          }
        }
      }
      return app
    },
    /**
     * 获取当前群应用列表
     * @param  {[type]} state   [description]
     * @return {[type]}         [description]
     */
    getGroupsApps: (state, getters, rootState) => (groupId = rootState.group.groupId, all) => {
      let apps = []
      let relations = state.groupRelations[groupId]
      if (relations) {
        relations.forEach(r => {
          if (r.status === 'd' || r.hideClient === 'all' || r.hideClient === 'web') {
            return
          }
          if (r.displayMode === 2 && !all) {
            return
          }
          let app = state.apps[r.type]
          if (Check.isNullObject(app) || Check.isNullString(app.name) || app.hideClient === 'all' || app.hideClient === 'web') {
            return
          }
          apps.push({
            relation: r,
            ...app,
            name: r.name || app.name
          })
        })
      }
      return apps
    },
    /**
     * 获取app新建列表
     * @param  {[type]} state     [description]
     * @param  {[type]} getters   [description]
     * @param  {[type]} rootState [description]
     * @return {[type]}           [description]
     */
    getCreateApps: (state, getters, rootState) => (groupId = rootState.group.groupId) => {
      const c = new Map()
      let relations = state.groupRelations[groupId]
      if (relations) {
        relations.forEach(r => {
          if (r.status === 'd' || r.displayMode !== 1 || r.hideClient === 'all' || r.hideClient === 'web') {
            return
          }
          let app = state.apps[r.type]
          if (Check.isNullObject(app) || Check.isNullString(app.name) || app.hideClient === 'all' || app.hideClient === 'web') {
            return
          }
          let key = app.appCategoryName || '其他'
          c.set(key, [
            ...(c.get(key) || []),
            ...[
              {
                relation: r,
                ...app,
                name: r.name || app.name
              }
            ]
          ])
        })
      }
      let categorys = []
      c.forEach((value, key) => {
        categorys.push({
          name: key,
          apps: value
        })
      })
      return categorys
    },
    /**
     * 获取应用分类列表
     * @param  {[type]} state     [description]
     * @param  {[type]} getters   [description]
     * @param  {[type]} rootState [description]
     * @return {[type]}           [description]
     */
    getCategoryApps: (state, getters, rootState) => (groupId = rootState.group.groupId) => {
      let dataMap = new Map()
      let keySet = new Set() // 保存分类名称，确保分类顺序不会乱
      let relations = state.groupRelations[rootState.group.groupId]
      if (relations) {
        relations.forEach(r => {
          if (r.status === 'd' || r.displayMode === 2 || r.hideClient === 'all' || r.hideClient === 'web') {
            return
          }
          let app = state.apps[r.type]
          if (Check.isNullObject(app) || Check.isNullString(app.name) || app.hideClient === 'all' || app.hideClient === 'web') {
            return
          }
          let key = app.appCategoryName || '其他'
          dataMap.set(key, [
            ...(dataMap.get(key) || []),
            ...[
              {
                relation: r,
                ...app,
                name: r.name || app.name
              }
            ]
          ])
          keySet.add(key)
        })
      }
      let categorys = []
      keySet.forEach((value, key) => {
        categorys.push({
          name: key,
          apps: dataMap.get(key)
        })
      })
      return categorys
    }
  },
  actions: {
    /**
     * 拉取群应用关系
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    async loadGroupApps({ state, commit, rootState }, groupId) {
      let _groupId = groupId || rootState.group.groupId
      if (_groupId) {
        const res = await Api.getGroupApps(_groupId)
        const relations = res.appRelations
        return new Promise((resolve, reject) => {
          if (Check.isRealArray(relations)) {
            commit('saveAppRelations', { groupId, relations })
            resolve(relations)
          } else {
            resolve([])
          }
        })
      }
    },
    /**
     * 修改应用关系
     * @param  {[type]} options.commit [description]
     * @param  {[type]} relation       [description]
     * @return {[type]}                [description]
     */
    modifyAppRelation({ commit }, relation) {
      commit('modifyAppRelation', relation)
    },
    setCurrentApp({ commit }, app) {
      commit('saveCurrentApp', app)
    }
  },
  mutations: {
    saveApps(state, apps) {
      apps.forEach(app => {
        Vue.set(state.apps, app.type, app)
      })
    },
    saveCurrentApp(state, app) {
      Vue.set(state, 'app', app)
    },
    saveAppRelations(state, { groupId, relations }) {
      Vue.set(state.groupRelations, groupId, relations)
    },
    modifyAppRelation(state, relation) {
      let id = relation.groupId
      state.groupRelations[id].some((r, i) => {
        if (r.id === relation.id) {
          Vue.set(state.groupRelations[id], i, { ...r, ...relation })
          return true
        }
      })
    },
    // 中移版本 新建回退两次
    setHandleBack(state, type) {
      state.handleBack = type
    },
    clearHandleBack(state) {
      state.handleBack = ''
    }
  }
}
