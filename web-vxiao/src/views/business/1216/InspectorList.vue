<template>
  <page title="值日人">
    <Relate :items="us" :plus="true" :reduce="true" @plus="handleAdd" @delete="handleRemove" />
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  data() {
    return {
      users: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      inspection: 'getInspection'
    }),
    us() {
      return this.users.map(v => { return { ...v, avatar: this.url(v.avatar) } })
    }
  },
  components: {
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  methods: {
    ...mapActions(['setInspection']),
    fetchData() {
      this.users = this.inspection.users || []
    },
    handleAdd() {
      this.routePush({ name: 'selectInspector1216' })
    },
    handleRemove(u, index) {
      const that = this
      let inspection = that.inspection
      let postData = {
        schoolId: that.currentGroup.parentId,
        dutyUsers: [{ ...u, status: 'd' }],
        round: inspection.item.round,
        placeId: inspection.item.placeId
      }
      Api.commitScheduleSetting(postData).then(res => {
        that.users.splice(index, 1)
        that.$message({ message: '操作成功', type: 'success' })
      })
    }
  }
}

</script>
