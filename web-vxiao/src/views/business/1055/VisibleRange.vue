<template>
  <Page hasSubmit
        title="可见范围"
        v-if="routeQuery('isSchool') && datas"
        @submit="onGroupSubmit">
    <SelectGroup :groups="datas"
                 :multiselect="true"
                 :cache="enroll.toUsers.length>0 ? enroll.toUsers : datas"
                 @change="onGroupChange" />
  </Page>
  <SelectUser title="可见范围"
              v-else-if="!routeQuery('isSchool') && datas"
              :users="datas"
              :multiselect="true"
              :cache="enroll.toUsers.length>0 ? enroll.toUsers : datas"
              @submit="commitHandle" />
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve),
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        checkGroups: [],
        datas: [],
        search: ''
      }
    },
    created() {
      // 设置请求头
      let that = this
      if (that.routeQuery('isSchool')) {
        Api.getGroups(that.routeQuery('groupId')).then(res => {
          that.datas = res.groups
          that.initDatas()
        })
      } else {
        Api.getCurrentGroupUsers(that.routeQuery('groupId')).then(res => {
          that.datas = res.relations
          that.initDatas()
        })
      }
    },
    methods: {
      ...mapActions(['saveEnroll']),
      onGroupSubmit() {
        if (this.checkGroups.length === 0) {
          this.$message({ type: 'warning', message: '还未选择任何群组' })
          return
        }
        this.commitHandle(this.checkGroups)
      },
      onGroupChange(arr) {
        this.checkGroups = arr
      },
      commitHandle(list) {
        let toUsers = []
        list.forEach(r => {
          let u = {
            groupId: r.groupId,
            status: 1,
            name: r.name,
            type: 'cc',
            userId: r.userId,
            userType: r.userType,
            avatar: r.avatar
          }
          if (this.routeQuery('isSchool') === 'true') {
            u.userId = r.id
            u.userType = 'group'
          }
          toUsers.push(u)
        })
        this.saveEnroll({ toUsers: toUsers })
        this.routeBack()
      },
      initDatas() {
        const that = this
        that.datas.forEach(d => {
          that.$set(d, 'selected', false)
          that.enroll.toUsers &&
            that.enroll.toUsers.forEach(v => {
              if (d.userId === v.userId) {
                that.$set(d, 'selected', true)
              }
            })
        })
      }
    },
    computed: {
      ...mapGetters({
        enroll: 'getEnroll'
      })
    }
  }
</script>
