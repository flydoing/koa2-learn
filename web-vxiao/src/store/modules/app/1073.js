export default {
  state: {
    classRoom: {
      classRoomCreate: {},
      settingTime: []
    }
  },
  getters: {
    getClassRoomCreate(state) {
      return state.classRoom.classRoomCreate
    },
    getSettingTime(state) {
      return state.classRoom.settingTime
    }
  },
  actions: {
    saveClassRoomCreate({
      commit
    }, classRoomCreate) {
      commit('saveClassRoomCreate', classRoomCreate)
    },
    clearClassRoomCreate({
      commit
    }) {
      commit('clearClassRoomCreate')
    },
    saveSettingTime({
      commit
    }, settingTime) {
      commit('saveSettingTime', settingTime)
    },
    clearSettingTime({
      commit
    }) {
      commit('clearSettingTime')
    }
  },
  mutations: {
    saveClassRoomCreate(state, classRoomCreate) {
      state.classRoom.classRoomCreate = {
        ...state.classRoom.classRoomCreate,
        ...classRoomCreate
      }
    },
    clearClassRoomCreate(state) {
      state.classRoom.classRoomCreate = {}
    },
    saveSettingTime(state, settingTime) {
      state.classRoom.settingTime = settingTime
    },
    clearSettingTime(state) {
      state.classRoom.settingTime = []
    }
  }
}
