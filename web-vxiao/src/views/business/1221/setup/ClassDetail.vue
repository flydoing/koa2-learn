<template>
  <Page :title="title">
    <div class="student-list">
      <item v-for="(u,i) in rule(users)" :key="i" @click="clickGroup(u)">
        <div slot="main">{{u.text}}</div>
        <div slot="remark" class="ellipsis">{{u.placeholder}}</div>
      </item>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    created() {
      this.groupId = this.routeQuery('groupId')
      this.title = this.routeQuery('title')
      this.getUsers()
    },
    data() { return { users: [], title: '详情' } },
    methods: {
      clickGroup(u) {
        this.routePush({
          name: 'storageList',
          query: {
            title: `${u.text}（${this.title}）`,
            schoolId: this.routeQuery('schoolId'),
            userId: u.userId,
            groupId: this.groupId
          }
        })
      },
      rule(users) {
        return users.map(u => {
          return {
            ...u,
            ...{
              text: [u.uname, u.height, this.labelSex(u.sex)].join(' '),
              placeholder: u.boxnum === 0 ? '待分配' : [u.boxname, u.boxnum].join('、')
            }
          }
        })
      },
      getUsers() {
        const that = this
        const loading = that.$loading({
          text: '加载中',
          background: 'rgba(255, 255, 255, .3)'
        })
        Api.loadClassStorageDetial(this.groupId).then(res => {
          loading.close()
          if (Check.isRealArray(res.allots)) {
            this.users = res.allots
          } else {
            this.$message.warning({ message: '该群组暂无用户' })
            this.$router.go(-1)
          }
        }).catch(res => loading.close())
      }
    }
  }

</script>
