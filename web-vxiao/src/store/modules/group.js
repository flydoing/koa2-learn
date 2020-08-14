import Check from '@/utils/check'
import Api from '@/api/group'
import Vue from 'vue'
import * as STORAGE from '@/constant/storage'
import * as Storage from '@/utils/storage'

export default {
  state: {
    educationId: null,
    branchId: null,
    groupId: null,
    groups: [],
    groupRelations: {},
    userGroupRelations: {}
  },
  actions: {
    /**
     * 从缓存中读取历史记录群
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    async initGroupCache({ dispatch, commit }, userId) {
      const cacheGroupId = await Storage.local.getString(`${userId}_${STORAGE.LOCAL_CACHE_GROUP}`)
      if (cacheGroupId) {
        commit('saveCurrentGroup', cacheGroupId)
        dispatch('loadGroupUsers', cacheGroupId)
      }
    },
    /**
     * 保存当前群状态
     * @param  {[type]} options.commit [description]
     * @param  {[type]} group          [description]
     * @return {[type]}                [description]
     */
    async currentGroupId({ commit, rootState }, groupId) {
      commit('saveCurrentGroup', groupId)
      Storage.local.set(`${rootState.USERID}_${STORAGE.LOCAL_CACHE_GROUP}`, groupId)
    },
    /**
     * 新增群组
     * @param {[type]} options.commit [description]
     * @param {[type]} options.state  [description]
     * @param {[type]} group          [description]
     */
    async addGroup({ commit, state }, group) {
      if (group) {
        let res = await Api.addGroup(group)
        return new Promise((resolve, reject) => {
          if (Check.isRealArray(res.groups)) {
            res.groups.forEach(g => {
              commit('saveGroup', g)
            })
          }
          if (Check.isRealArray(res.relations)) {
            res.relations.forEach(r => {
              commit('saveGroupRelation', r)
            })
          }
          resolve(res)
        })
      }
    },
    /**
     * 新增课程群
     * @param {[type]} options.commit [description]
     * @param {[type]} options.state  [description]
     * @param {[type]} group          [description]
     */
    async addCourse({ commit, state }, course) {
      if (course) {
        let res = await Api.addCourse(course)
        return new Promise((resolve, reject) => {
          if (Check.isRealArray(res.groups)) {
            res.groups.forEach(g => {
              commit('saveGroup', g)
            })
          }
          if (Check.isRealArray(res.relations)) {
            res.relations.forEach(r => {
              commit('saveGroupRelation', r)
            })
          }
          resolve(res)
        })
      }
    },
    /**
     * 保存当前群关系
     * @param  {[type]} options.commit [description]
     * @param  {[type]} groupId        [description]
     * @return {[type]}                [description]
     */
    async loadGroupUsers({ commit }, groupId) {
      if (groupId) {
        let relations = (await Api.getGroupAllUsers(groupId, '4')).relations || []
        return new Promise(resolve => {
          if (Check.isRealArray(relations)) {
            commit('saveGroupRelations', { groupId, relations })
            resolve(relations)
          } else {
            resolve([])
          }
        })
      }
    },
    /**
     * 添加用户
     * @Author   clz
     * @DateTime 2018-09-04
     * @param    {[type]}   options.commit
     * @param    {[type]}   options.state
     * @param    {[type]}   relations
     */
    async addGroupUsers({ commit }, relations) {
      let res = await Api.addGroupRelation(relations)
      return new Promise((resolve, reject) => {
        if (Check.isRealArray(res.relations)) {
          res.relations.forEach(r => {
            commit('saveGroupRelation', r)
          })
          resolve(res.relations)
        } else {
          reject(res)
        }
      })
    },
    /**
     * 修改单个群信息
     * @param  {[type]} options.commit [description]
     * @param  {[type]} options.state  [description]
     * @param  {[type]} group          [description]
     * @return {[type]}                [description]
     */
    modifyGroup({ commit }, group) {
      commit('modifyGroup', group)
    },
    /**
     * 修改群关系
     * @param  {[type]} options.commit [description]
     * @param  {[type]} options.state  [description]
     * @param  {[type]} groupId        [description]
     * @param  {[type]} relation       [description]
     * @return {[type]}                [description]
     */
    modifyRelation({ commit, rootState }, relation) {
      commit('modifyRelation', relation)
      if (rootState.USERID === relation.userId) {
        commit('modifyUserRelation', relation)
      }
    },
    /**
     * 插入群用户（主要是给学校类型的群用，插入管理员）
     * @param  {[type]} options.commit [description]
     * @param  {[type]} options.state  [description]
     * @param  {[type]} groupId        [description]
     * @param  {[type]} relations      [description]
     * @return {[type]}                [description]
     */
    insertRelations({ commit }, { groupId, relations }) {
      commit('saveGroupRelations', { groupId, relations })
    },
    /**
     * 设置层级groupId（从学校层面跳转到->班群）
     * @param {*} param0
     * @param {*} branchId
     */
    modifyBranchId({ commit }, branchId) {
      commit('modifyBranchId', branchId)
    },
    /**
     * 设置层级groupId（从教育局层面跳转到->学校/企业）
     * @param {*} param0
     * @param {*} branchId
     */
    modifyEducationId({ commit }, educationId) {
      commit('modifyEducationId', educationId)
    }
  },
  getters: {
    getEducationId(state) {
      return state.educationId
    },
    getBranchId(state) {
      return state.branchId
    },
    getGroupMenus(state, rootGetters) {
      let _groups = []
      let groups = state.groups || []
      groups.some(g => {
        if (g.status !== 'd' && g.status !== '4') {
          let bubbles = rootGetters['getNotifyBubble'].filter(m => {
            return m.groupId === g.groupId && m.status !== 'd' && m.status !== '4'
          })
          _groups.push({
            bubbleCount: bubbles.length,
            ...g
          })
        }
      })
      return _groups
    },
    getGroupId(state) {
      return state.groupId
    },
    getGroups(state) {
      let groups = state.groups || []
      return groups.filter(g => {
        return g.status !== 'd'
      })
    },
    /**
     * 当前活动群
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    getCurrentGroup(state) {
      let groups = state.groups || []
      return (
        groups.filter(g => {
          return state.groupId === g.groupId
        })[0] || {}
      )
    },
    /**
     * 获取群
     * @param  {[type]} groupId [description]
     * @return {[type]}         [description]
     */
    getGroupById: state => groupId => {
      let groups = state.groups || []
      return (
        groups.filter(g => {
          return g.groupId === groupId
        })[0] || {}
      )
    },
    /**
     * 获取学校下面的班群
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getGroupsBySchoolId: state => schoolId => {
      let groups = state.groups || []
      return groups.filter(g => {
        return g.parentId === schoolId && g.type !== '5'
      })
    },
    /**
     * 根据学校Id获取学校群组
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    getSchoolBySchoolId: state => schoolId => {
      let group = null
      let groups = state.groups || []
      groups.forEach((g, i) => {
        if (g.parentId === schoolId && g.type === '5') {
          group = g
          return false
        }
      })
      return group
    },
    /**
     * 校验是否群组管理员
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    isGroupAdmin: state => gid => {
      let r = state.userGroupRelations[gid] || {}
      return r.type === '1'
    },
    /**
     * 验证某个用户是否是管理员
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    isGroupAdminByUser: state => (uid, gid) => {},
    /**
     * 获取群关系
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    getGroupUsers: state => (groupId, types) => {
      let users = state.groupRelations[groupId] || []
      if (Check.isRealArray(users) && types) {
        return users.filter(r => {
          return types.indexOf(r.userType) > -1 && r.status !== 'd'
        })
      }
      return users
    },
    /**
     * 获取当前群关系
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    getCurrentGroupUsers(state) {
      return state.groupRelations[state.groupId]
    },
    /**
     * 根据群id和用户Id获取relation
     * @param  {[type]} groupId [description]
     * @param  {[type]} userId  [description]
     * @return {[type]}         [description]
     */
    getRelationById: state => (groupId, userId) => {
      let relations = state.groupRelations[groupId]
      if (relations) {
        let _relation = {}
        relations.some(relation => {
          if (relation.userId === userId) {
            _relation = relation
            return true
          }
        })
        return _relation
      }
      return relations && relations.length > 0 ? relations[0] : null
    },
    /**
     * 根据群id和用户Id获取relation
     * @param  {[type]} groupId [description]
     * @param  {[type]} userId  [description]
     * @return {[type]}         [description]
     */
    getCurrentRelationById: state => (groupId = state.groupId) => {
      return state.userGroupRelations[groupId]
    }
  },
  mutations: {
    // 当前群Id
    saveCurrentGroup(state, groupId) {
      state.groupId = groupId
    },
    // 保存群list
    saveGroups(state, groups) {
      state.groups = groups
    },
    // 保存单个群
    saveGroup(state, g) {
      state.groups.push(g)
    },
    // 更新单个群
    modifyGroup(state, group) {
      // ArrayUtils.replace(state.groups, group)
      state.groups.some((g, i) => {
        if (g.groupId === group.groupId) {
          // if (group.status === 'd') {
          //   state.groups.splice(i, 1)
          // } else {
          Vue.set(state.groups, i, { ...g, ...group })
          // }
          return true
        }
      })
    },
    // 保存当前登录用户群关系（所有群）
    saveSigninGroupRelation(state, relations) {
      if (relations) {
        let u = {}
        relations.some(r => {
          u[r.groupId] = r
        })
        state.userGroupRelations = u
      }
    },
    // 保存群关系（用户关系）``
    saveGroupRelations(state, { groupId, relations }) {
      Vue.set(state.groupRelations, groupId, relations)
    },
    // 保存单个群关系
    saveGroupRelation(state, relation) {
      let groupId = relation.groupId
      if (state.groupRelations[groupId]) {
        state.groupRelations[groupId].push(relation)
      } else {
        Vue.set(state.groupRelations, groupId, relation)
      }
    },
    // 更新群关系用户关系）
    modifyRelation(state, relation) {
      let id = relation.groupId
      state.groupRelations[id].some((r, i) => {
        if (r.userId === relation.userId) {
          if (relation.status === 'd') {
            state.groupRelations[id].splice(i, 1)
          } else {
            Vue.set(state.groupRelations[id], i, { ...r, ...relation })
          }
          return true
        }
      })
    },
    // 更新当前用户的relation
    modifyUserRelation(state, relation) {
      let r = state.userGroupRelations[relation.groudId]
      Vue.set(state.userGroupRelations, r.groupId, { ...r, ...relation })
    },
    // 更新层级GroupId
    modifyBranchId(state, branchId = null) {
      state.branchId = branchId
    },
    // 更新层级GroupId
    modifyEducationId(state, educationId = null) {
      state.educationId = educationId
    }
  }
}
