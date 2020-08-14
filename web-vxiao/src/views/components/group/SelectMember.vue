<template>
  <SelectUser :title="title"
              :cache="cache"
              :users="users"
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
        users: [],
        cache: [],
        multiple: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || '选择成员'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let params = that.obj.params

        let uMap = new Map()
        if (params.filters) {
          params.filters.forEach(v => {
            uMap.set(v.userId, v)
          })
        }

        if (params.loadData) {
          params.loadData(datas => {
            if (datas) {
              that.users = datas.filter(v => {
                return Check.isNullObject(uMap.get(v.userId))
              })
            }
          })
        } else {
          GroupApi.getGroupUsers(that.groupId).then(res => {
            if (res.relations) {
              that.users = res.relations.filter(v => {
                return Check.isNullObject(uMap.get(v.userId))
              })
            }
          })
        }

        that.cache = params.users
        that.multiple = params.multiple || false
      },
      handleSubmit(ms) {
        const that = this
        let params = that.obj.params
        if (params.callback) {
          params.callback(ms, datas => {
            if (datas) {
              that.setStorage(`_business_${params.appType}_${params.property}_cache`, datas)
            }
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        } else {
          that.setStorage(`_business_${params.appType}_${params.property}_cache`, ms)
          that.routeBack()
        }
      }
    }
  }
</script>
