<template>
  <page title="代课老师">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleSelect(item)"
          :label="item.name">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
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
        exchange: 'getExchangeCourse'
      })
    },
    methods: {
      ...mapActions(['setExchangeCourse']),
      fetchData() {
        let form = this.exchange.form
        let cell = this.exchange.cell
        let subjectId = this.routeQuery('sid')
        Api.getSubTeachers(this.userId, cell.id, form.date.startTime, form.date.endTime, subjectId).then(res => {
          if (res.datas) {
            this.list = res.datas
          } else {
            this.$message({ type: 'warning', message: '暂无可代课老师' })
          }
        })
      },
      handleSelect(item) {
        let subjectId = this.routeQuery('sid')
        let form = this.exchange.form
        let cell = this.exchange.cell
        let postData = {
          apply: {
            groupId: cell.groupId,
            fromUserId: this.userId,
            type: '2',
            fromCellId: cell.id,
            toUserId: item.userId
          }
        }

        Api.saveCourse(postData).then(res => {
          this.setExchangeCourse({ form: { ...form, hasChange: true, clsGroupId: item.groupId } })
          if (subjectId) {
            this.routeBack(-2)
          } else {
            this.routeBack()
          }
        })
      }
    }
  }
</script>
