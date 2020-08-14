<template>
  <page :title="title">
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
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        if (this.obj.tableData) {
          this.modifyCreateObjectField('tableData')
        }
        let userId = this.routeQuery('userId') || this.userId
        Api.getTeachAchievementHistory(userId).then(res => {
          if (res.table) {
            this.list = res.table.items || []
          }
        })
      },
      handleItem(item) {
        let userId = this.routeQuery('userId') || this.userId
        Api.getTeachAchievementData(userId, item.params.id).then(res => {
          this.setCreateObject({ tableData: res.table })
          this.routePush({
            name: 'dataView1179',
            query: {
              title: item.name
            }
          })
        })
      }
    }
  }
</script>
