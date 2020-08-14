import Check from '@/utils/check'
import Api from '@/api/user'
export default {
  state: {
    themes: []
  },
  actions: {
    async loadCustomThemes({ commit }) {
      const res = await Api.getThemes()
      const backgrounds = res.backgrounds
      if (Check.isRealArray(backgrounds)) {
        commit('saveThemes', backgrounds)
      }
    }
  },
  getters: {
    getCustomThemes(state) {
      return state.themes
    },
    getCurrentTheme(state, getters, rootState) {
      // const metas = rootState.meta.metaDatas
      let theme = '/static/bg/bg.jpg'
      // if (Check.isRealArray(metas)) {
      //   metas.some(m => {
      //     if (m.metaType === 'm_background') {
      //       theme = `${rootState.FILE_URL}/${m.obj}`
      //       return true
      //     }
      //   })
      // }
      return theme
    }
  },
  mutations: {
    saveThemes(state, themes) {
      state.themes = themes
    },
    saveUserTheme({ state, rootState }, theme) {
      state.themes.push(theme)
    }
  }
}
