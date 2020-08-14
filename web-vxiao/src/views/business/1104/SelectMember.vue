<template>
  <SelectUser title="选择成员"
              :users="users"
              :needValidate="false"
              :multiselect="false"
              @change="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from './api'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: [],
        persons: {}
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
      fetchData() {
        const that = this
        let user = this.crm.user || {}
        GroupApi.getGroupUsers(that.groupId).then(res => {
          that.users = res.relations.filter(v => {
            return v.userId !== user.userId
          })
        })
      },
      handleSubmit(ms) {
        // 会拿到缓存里面的数据
        let that = this
        let user = this.crm.user
        // 判断这个id是否为空字符串
        let postData = null
        if (user) {
          postData = {
            id: user.id,
            userId: ms.userId,
            groupId: that.groupId,
            appType: user.appType,
            level: user.level
          }
        } else {
          postData = {
            userId: ms.userId,
            groupId: that.groupId,
            appType: '1104',
            level: this.crm.type
          }
        }

        Api.addOrremove({ persons: [postData] }).then(res => {
          this.routeBack()
        })
      }
    }
  }
</script>
