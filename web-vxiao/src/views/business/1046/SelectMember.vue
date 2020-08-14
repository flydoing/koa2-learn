<template>
  <SelectUser title="选择成员"
              :cache="cache"
              :users="members"
              :multiselect="multiple"
              @change="handleSubmit"
              @submit="handleSubmit" />
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        members: [],
        cache: [],
        multiple: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    methods: {
      ...mapActions(['setCrm']),
      fetchData() {
        const that = this
        let mMap = new Map()
        if (this.crm.members) {
          this.crm.members.map(v => {
            mMap.set(v.userId, v)
          })
        }
        GroupApi.getGroupUsers(that.groupId).then(res => {
          if (res.relations) {
            that.members = res.relations.filter(v => {
              return Check.isNullObject(mMap.get(v.userId))
            })
          }
        })
        let params = this.crm.params
        that.cache = params.users
        that.multiple = params.multiple || false
      },
      handleSubmit(ms) {
        const that = this
        let params = this.crm.params
        if (params.callback) {
          params.callback(ms, datas => {
            if (datas) {
              this.setStorage(`_crm_business_${params.property}_cache`, datas)
            }
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        } else {
          this.setStorage(`_crm_business_${params.property}_cache`, ms)
          this.routeBack()
        }
      }
    }
  }
</script>
