<template>
  <SelectUser title="选择成员" :cache="cache" :users="users" :needValidate="false" :multiselect="true" @submit="handleSubmit"></SelectUser>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import GroupApi from '@/api/group'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  components: {
    SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
  },
  data() {
    return {
      users: [],
      cache: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      onDuty: 'getOnDuty'
    })
  },
  methods: {
    ...mapActions(['setOnDuty']),
    fetchData() {
      const that = this
      let group = that.onDuty.group
      that.cache = group.members || []

      let uMap = new Map()
      if (Check.isRealArray(that.onDuty.users)) {
        that.onDuty.users.map(v => { uMap.set(v.userId, v) })
      }
      if (Check.isRealArray(that.onDuty.objects)) {
        that.onDuty.objects.map(v => {
          if (v.groupId !== group.groupId) {
            v.members.map(m => { uMap.set(m.userId, m) })
          }
        })
      }

      GroupApi.getGroupUsers(group.groupId).then(res => {
        that.users = res.relations.filter(v => {
          return !uMap.get(v.userId)
        })
      })
    },
    handleSubmit(ms) {
      this.setOnDuty({
        group: {
          ...this.onDuty.group,
          remark: ms.length ? `${ms.length}位成员` : '',
          members: ms
        }
      })
      this.routeBack()
    }
  }
}

</script>
