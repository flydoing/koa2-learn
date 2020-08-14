export default {
  // state => 存放数据，mutation修改了state的数据会改变这个遍历的所有值
  // getters => getter用来获取数据，mapgetter经常在计算属性中被使用,mapw为一个映射
  // actions => 像一个装饰器，包裹mutations，使之可以异步。
  // mutations => 提交更改数据的方法，同步！
  state: {
    teacherDate: {}
  },
  getters: {
    getTeacherDate(state) {
      return state.teacherDate
    }
  },
  actions: {
    setTeacherDate({ commit }, teacherDate) {
      commit('saveTeacherDate', teacherDate)
    }
  },
  mutations: {
    saveTeacherDate(state, teacherDate) {
      state.teacherDate = { ...state.teacherDate, ...teacherDate }
    }
  }
}
