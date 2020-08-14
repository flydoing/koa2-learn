export default {
  state: {
    applycanId: null,
    enroll: {
      content: '',
      title: '',
      toUsers: [],
      times: [
        {
          type: 'end',
          setTime: ''
        },
        {
          type: 'start',
          setTime: ''
        }
      ],
      medias: []
    },
    question: {
      isAudit: 1,
      enrollTable: {
        metaDatas: [],
        questionnaire: {
          questions: []
        }
      }
    },
    personalInfo: {
      enrollTable: {
        metaDatas: [],
        questionnaire: {
          id: null,
          questions: []
        }
      }
    },
    cacheData: {},
    inputType: {}, // 输入格式
    radioDetailList: [], // 单选详情列表
    checkboxDetailList: [] // 复选框详情列表
  },
  getters: {
    getEnroll(state) {
      return state.enroll
    },
    getQuestion(state) {
      return state.question
    },
    getPersonalInfo(state) {
      return state.personalInfo
    },
    getCacheData(state) {
      return state.cacheData
    },
    getApplycanId(state) {
      return state.enrollId
    },
    getRadioDetailList(state) {
      return state.radioDetailList
    },
    getCheckboxDetailList(state) {
      return state.checkboxDetailList
    },
    getInputType(state) {
      return state.inputType
    },
    CheckboxItemDetailList(state) {
      return state.checkboxDetailList
    },
    RadioItemDetailList(state) {
      return state.radioDetailList
    }
  },
  actions: {
    getCheckboxItemDetailList({ commit }, arr) {
      commit('getCheckboxItemDetailList', arr)
    },
    getRadioItemDetailList({ commit }, arr) {
      commit('getRadioItemDetailList', arr)
    },
    saveInputType({ commit }, obj) {
      commit('saveInputType', obj)
    },
    saveRadioDetailList({ commit }, obj) {
      commit('saveRadioDetailList', obj)
    },
    clearRadioDetailList({ commit }, obj) {
      commit('clearRadioDetailList', obj)
    },
    clearCheckboxDetailList({ commit }, obj) {
      commit('clearCheckboxDetailList', obj)
    },
    saveCheckboxDetailList({ commit }, obj) {
      commit('saveCheckboxDetailList', obj)
    },
    deleteRadioDetailItem({ commit }, index) {
      commit('deleteRadioDetailItem', index)
    },
    deleteCheckboxDetailItem({ commit }, index) {
      commit('deleteCheckboxDetailItem', index)
    },
    saveEnroll({ commit }, enroll) {
      commit('saveEnroll', enroll)
    },
    saveQuestion({ commit }, question) {
      commit('saveQuestion', question)
    },
    savePersonalInfo({ commit }, personalInfo) {
      commit('savePersonalInfo', personalInfo)
    },
    saveCacheData({ commit }, obj) {
      commit('saveCacheData', obj)
    },
    saveApplycanId({ commit }, id) {
      commit('saveApplycanId', id)
    },
    clearApplyCache({ commit }) {
      commit('clearApplyCache')
    }
  },
  mutations: {
    clearRadioDetailList(state) {
      state.radioDetailList = []
    },
    clearCheckboxDetailList(state) {
      state.checkboxDetailList = []
    },
    getRadioItemDetailList(state, arr) {
      state.radioDetailList = arr
    },
    getCheckboxItemDetailList(state, arr) {
      state.checkboxDetailList = arr
    },
    saveInputType(state, obj) {
      state.inputType = obj
    },
    saveRadioDetailList(state, obj) {
      if (obj.type === 'add') {
        state.radioDetailList.push(obj)
        console.log(state.radioDetailList, 'state.radioDetailList')
      } else {
        state.radioDetailList.splice(obj.index, 1, obj)
      }
    },
    saveCheckboxDetailList(state, obj) {
      if (obj.type === 'add') {
        state.checkboxDetailList.push(obj)
      } else {
        state.checkboxDetailList.splice(obj.index, 1, obj)
      }
    },
    deleteRadioDetailItem(state, index) {
      state.radioDetailList.splice(index, 1)
    },
    deleteCheckboxDetailItem(state, index) {
      state.checkboxDetailList.splice(index, 1)
    },
    saveEnroll(state, enroll) {
      state.enroll = {
        ...state.enroll,
        ...enroll
      }
    },
    saveQuestion(state, question) {
      state.question = {
        ...state.question,
        ...question
      }
    },
    savePersonalInfo(state, personalInfo) {
      state.personalInfo = {
        ...state.personalInfo,
        ...personalInfo
      }
    },
    saveCacheData(state, obj) {
      state.cacheData = obj
    },
    saveApplycanId(state, id) {
      state.enrollId = id
    },
    clearApplyCache(state) {
      state.applycanId = null
      state.enroll = {
        content: '',
        title: '',
        toUsers: [],
        times: [
          {
            type: 'end',
            setTime: ''
          },
          {
            type: 'start',
            setTime: ''
          }
        ],
        medias: []
      }
      state.question = {
        isAudit: 1,
        enrollTable: {
          metaDatas: [],
          questionnaire: {
            questions: []
          }
        }
      }
      state.personalInfo = {
        enrollTable: {
          metaDatas: [],
          questionnaire: {
            id: null,
            questions: []
          }
        }
      }
    }
  }
}
