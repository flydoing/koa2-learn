<template>
  <SelectUser title="选择成员" :cache="cache" :users="members" :multiselect="true" @submit="handleSubmit" />
</template>
<script>
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      members: [],
      cache: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      inspection: 'getInspection'
    })
  },
  methods: {
    ...mapActions(['setInspection']),
    fetchData() {
      const that = this
      let group = that.inspection.group
      let users = that.inspection.users

      let uMap = new Map()
      if (Check.isRealArray(users)) {
        users.map(v => { uMap.set(v.userId, v) })
      }

      if (group) {
        that.cache = group.members || []
        GroupApi.getGroupUsers(group.groupId).then(res => {
          that.members = res.relations.filter(v => { return !Check.isObject(uMap.get(v.userId)) })
        })
      }
    },
    handleSubmit(ms) {
      this.setInspection({
        group: {
          ...this.inspection.group,
          remark: ms.length ? `${ms.length}位成员` : '',
          members: ms
        }
      })
      this.routeBack()
    }
  }
}

</script>
