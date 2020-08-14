<template>
  <SelectUser title="选择老师" :cache="cache" :users="users" :multiselect="false" @change="handleSelect"></SelectUser>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
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
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        const that = this
        let user = {}
        if (Check.isRealArray(this.selection.teachers)) {
          user = this.selection.teachers[0]
        }
        GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
          that.users = res.relations.map(v => {
            v.id = v.userId
            if (user.userId === v.userId) {
              that.cache = [v]
            }
            return v
          })
        })
      },
      handleSelect(u) {
        this.setSelection({ teachers: [u] })
        this.routeBack()
      }
    }
  }

</script>
