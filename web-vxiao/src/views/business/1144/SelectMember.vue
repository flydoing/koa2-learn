<template>
  <SelectUser title="选择成员" :cache="cache" :users="users" :multiselect="true" @submit="handleSubmit"></SelectUser>
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
      classMedal: 'getClassMedal'
    })
  },
  methods: {
    ...mapActions(['setClassMedal']),
    fetchData() {
      const that = this
      that.cache = that.classMedal.dimension.users || []
      GroupApi.getGroupUsers(that.currentGroup.groupId).then(res => {
        if (Check.isRealArray(res.relations)) {
          that.users = res.relations.map(v => { return { ...v, selected: false } })
        }
      })
    },
    handleSubmit(users) {
      this.setClassMedal({ dimension: { ...this.classMedal.dimension, users: users, remarkTxt: `${users.length}人` } })
      this.routeBack()
    }
  }
}

</script>
