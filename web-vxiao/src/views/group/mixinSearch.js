import UserEnum from '@/constant/user'
export default {
  components: {
    Alphabet: resolve => require(['../components/Alphabet'], resolve)
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    searchUsers() {
      let search = this.search.toLowerCase()
      let arr = this.selectUsers
      if (!arr) {
        return []
      }
      if (search) {
        arr = this.selectUsers.filter(user => {
          return user.name.toLowerCase().indexOf(search) > -1 || user.pinyin.toLowerCase().indexOf(search) > -1
        })
      }
      let obj = { 师: [], 组: [] }
      let others = []
      arr.forEach(user => {
        if (user.type === 'group') {
          obj['组'].push(user)
          return null
        }
        if (user.userType === UserEnum.TEACHER.key) {
          obj['师'].push(user)
          return null
        }
        let letter = user.pinyin ? user.pinyin.charAt(0).toLocaleUpperCase() : ''
        const p = /[a-z]/i
        if (!p.test(letter)) {
          others.push(user)
          return null
        }
        if (obj.hasOwnProperty(letter)) {
          obj[letter].push(user)
        } else {
          obj[letter] = [user]
        }
      })
      if (obj['师'].length < 1) {
        delete obj['师']
      }
      if (obj['组'].length < 1) {
        delete obj['组']
      }
      if (others && others.length > 0) {
        obj['#'] = others
      }
      return obj
    },
    searchIndex() {
      return Object.keys(this.searchUsers)
    }
  },
  methods: {
    scrollToIndex(index) {
      this.$refs._page.getScroll().scrollIntoView(this.$refs[index][0])
    }
  }
}
