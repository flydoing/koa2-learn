import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      groups: 'getGroupMenus'
    })
  },
  methods: {
    getSchoolGroupId(parentId) {
      let schoolGroupId = ''
      this.groups.forEach((g) => {
        if (g.parentId === parentId && g.type === '5') {
          schoolGroupId = g.groupId
        }
      })
      return schoolGroupId
    }
  }
}
