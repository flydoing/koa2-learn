<template>
  <page title="选择时间">
    <item v-for="(item,i) in list" :key="i" @click="handleSelect(item)">
      <div slot="main" v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

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
    computed: {},
    methods: {
      fetchData() {
        Api.loadTimes().then(res => {
          if (res.datas) {
            this.list = res.datas
          }
        })
      },
      handleSelect(item) {
        this.setStorage('coursetbl_date', item)
        this.routeBack()
      }
    }
  }

</script>
