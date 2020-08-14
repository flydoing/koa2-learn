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
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: (resolve) => require(['@/views/components/group/SelectUser'], resolve)
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
        approve: 'getGiveBack'
      })
    },
    methods: {
      fetchData() {
        const that = this
        let filterMap = new Map()
        if (Check.isRealArray(that.approve.filters)) {
          that.approve.filters.map((v) => {
            filterMap.set(v.userId, v)
          })
        }
        GroupApi.getGroupUsers(that.currentGroup.groupId).then((res) => {
          that.users = res.relations.filter((v) => {
            return !Check.isObject(filterMap.get(v.userId))
          })
        })
      },
      handleSubmit(ms) {
        // 会拿到缓存里面的数据
        let that = this
        let personsId = this.approve.personsId
        // 判断这个id是否为空字符串
        if (!Check.isNullString(personsId)) {
          this.persons = {
            persons: [
              {
                id: personsId,
                userId: ms.userId,
                groupId: that.groupId,
                appType: '1211',
                level: '1'
              }
            ]
          }
        } else {
          this.persons = {
            persons: [
              {
                userId: ms.userId,
                groupId: that.groupId,
                appType: '1211',
                level: '1'
              }
            ]
          }
        }
        Api.addOrremove(this.persons).then((res) => {
          this.routeBack()
        })
      }
    }
  }
</script>
