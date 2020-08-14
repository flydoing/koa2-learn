<template>
  <page title="教师发展档案">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item,i)"
          :label="item.name"
          :remark="item.value">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        isEdit: 1
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.isEdit) {
          this.modifyCreateObjectField('isEdit')
        }
        let userId = this.routeQuery('userId') || this.userId
        Api.getTeacherArchives(userId).then(res => {
          if (res.item) {
            this.list = res.item.basicInfo
            this.isEdit = res.item.isEdit
          }
        })
      },
      handleItem(item) {
        let userId = this.routeQuery('userId') || this.userId
        let userName = this.routeQuery('userName') || this.userInfo.name
        let query = {
          title: `${item.name} - ${userName}`,
          userId: userId
        }
        this.setCreateObject({ isEdit: this.isEdit })
        switch (item.type) {
          case '1':
            this.routePush({ name: 'basicInfo1179', query: query })
            break
          case '2':
            this.routePush({ name: 'resumeList1179', query: query })
            break
          case '3':
            this.routePush({ name: 'process1179', query: query })
            break
          case '4':
            this.routePush({ name: 'achievement1179', query: query })
            break
          case '6':
            this.routePush({ name: 'commendations1179', query: query })
            break
        }
      }
    }
  }
</script>
