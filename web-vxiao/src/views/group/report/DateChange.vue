<template>
  <Page class="date-list"
        hasSubmit
        @submit="handleSubmit">
    <div class="category-title text">自定义</div>
    <item label="开始时间"
          :remark="start.name"
          @click="handleCustom('1')">
    </item>
    <item label="结束时间"
          :remark="end.name"
          @click="handleCustom('2')">
    </item>
    <div class="category-title"></div>
    <Item v-for="(date,i) in items"
          :key="i"
          @click="handle(date)">
      <div slot="main">{{date.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        items: [],
        start: {},
        end: {}
      }
    },
    computed: {},
    created() {
      this.start = this.getStorage('_change_date_start', true) || {}
      this.end = this.getStorage('_change_date_end', true) || {}
      const loading = this.$loading({
        lock: true,
        target: '.date-list'
      })
      Api.loadTimes(this.routeQuery('groupId'), this.routeQuery('appType'), this.routeQuery('timeType')).then(res => {
        loading.close()
        if (res.table) {
          this.items = res.table.items
        }
      })
    },
    methods: {
      handleCustom(type) {
        let query = {
          groupId: this.routeQuery('groupId'),
          appType: this.routeQuery('appType'),
          timeType: this.routeQuery('timeType')
        }
        if (type === '1') {
          query.isStart = 1
        }
        this.routePush({
          name: 'reportCustomDateChange',
          query: query
        })
      },
      handle(date) {
        this.setStorage('_change_date', date.params)
        this.routeBack()
      },
      handleSubmit() {
        if (Check.isNullObject(this.start)) {
          this.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullObject(this.end)) {
          this.$message({ message: '结束时间不能为空', type: 'warning' })
          return false
        }
        this.setStorage('_change_date', {
          ...this.start.params,
          endDate: this.end.params.endDate
        })
        this.routeBack()
      }
    }
  }
</script>
