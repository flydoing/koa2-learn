<template>
  <page title="选择时间"
        listenBack
        @back="handleBack">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleSelect(item)"
          :label="item.name"
          :remark="item.count || ''">
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
      ...mapActions(['setExchangeCourse', 'deleteExchangeCourseProp']),
      fetchData() {
        let date = this.exchange.form.date
        if (this.exchange.weekDate) {
          this.deleteExchangeCourseProp('weekDate')
        }
        let course = this.exchange.course
        Api.getTimePeriods(course.groupId, date.startTime).then(res => {
          if (res.datas) {
            this.list = res.datas
          }
        })
      },
      handleSelect(item) {
        this.setExchangeCourse({ weekDate: item })
        this.routePush({ name: 'selectCourse1234', title: item.name })
      },
      handleBack() {
        this.setExchangeCourse({
          form: {
            ...this.exchange.form,
            curIndex: null,
            clsGroupId: null,
            showWeekExchange: false
          }
        })
        this.routeBack()
      }
    }
  }
</script>
