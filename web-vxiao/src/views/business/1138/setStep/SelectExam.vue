<template>
  <page title="选择联考成绩"
        hasAdd
        @Add="handleAdd">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item, i)"
          :label="item.name">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
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
      ...mapActions(['setCreateObject']),
      fetchData() {
        Api.getExams(this.groupId).then(res => {
          this.list = res.exams || []
        })
      },
      handleItem(item, index) {
        this.setCreateObject({ exam: item })
        this.routeBack()
      },
      handleAdd() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1123',
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
