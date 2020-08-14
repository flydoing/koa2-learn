export default {
  state: {
    result: {
      createInfo: {
        stairs: [{
          total: 100,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 85
            },
            {
              grade: 'B',
              value: 70
            },
            {
              grade: 'C',
              value: 60
            },
            {
              grade: 'D',
              value: 60
            }
          ]
        }, {
          total: 120,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 100
            },
            {
              grade: 'B',
              value: 85
            },
            {
              grade: 'C',
              value: 72
            },
            {
              grade: 'D',
              value: 72
            }
          ]
        }, {
          total: 150,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 130
            },
            {
              grade: 'B',
              value: 110
            },
            {
              grade: 'C',
              value: 90
            },
            {
              grade: 'D',
              value: 90
            }
          ]
        }]
      }
    }
  },
  getters: {
    getResultCreateInfo(state) {
      return state.result.createInfo
    }
  },
  actions: {
    saveResultCreateInfo({
      commit
    }, info) {
      commit('saveResultCreateInfo', info)
    },
    clearResultInfo({
      commit
    }) {
      commit('clearResultInfo')
    }
  },
  mutations: {
    saveResultCreateInfo(state, info) {
      state.result.createInfo = {
        ...state.result.createInfo,
        ...info
      }
    },
    clearResultInfo(state) {
      state.result.createInfo = {
        stairs: [{
          total: 100,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 85
            },
            {
              grade: 'B',
              value: 70
            },
            {
              grade: 'C',
              value: 60
            },
            {
              grade: 'D',
              value: 60
            }
          ]
        }, {
          total: 120,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 100
            },
            {
              grade: 'B',
              value: 85
            },
            {
              grade: 'C',
              value: 72
            },
            {
              grade: 'D',
              value: 72
            }
          ]
        }, {
          total: 150,
          isSelect: false,
          ladders: [{
              grade: 'A',
              value: 130
            },
            {
              grade: 'B',
              value: 110
            },
            {
              grade: 'C',
              value: 90
            },
            {
              grade: 'D',
              value: 90
            }
          ]
        }]
      }
    }
  }
}
