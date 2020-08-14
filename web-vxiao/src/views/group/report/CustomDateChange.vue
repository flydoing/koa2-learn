<template>
  <Page class="date-list">
    <Item v-for="(date,i) in items"
          :key="i"
          @click="handle(date)">
      <div slot="main">{{date.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return { items: [] }
    },
    created() {
      const loading = this.$loading({
        lock: true,
        target: '.date-list'
      })
      Api.loadTimes(this.routeQuery('groupId'), this.routeQuery('appType'), this.routeQuery('timeType'), 1).then(res => {
        loading.close()
        if (res.table) {
          this.items = res.table.items
        }
      })
    },
    methods: {
      handle(date) {
        if (this.routeQuery('isStart')) {
          this.setStorage('_change_date_start', date)
        } else {
          this.setStorage('_change_date_end', date)
        }
        this.routeBack()
      }
    }
  }
</script>
