<template>
  <AppPage :title="app.name"
           ref="_page">
    <AppCommon :app="curApp" />
    <div class="category-title"
         v-if="list.length>0"></div>
    <Item v-for="(item,i) in list"
          :key="i"
          :item="item"
          @click="handleCountdown(item)">
      <div v-html="itemTxt(item)"></div>
      <div slot="remark"
           class="ellipsis"
           v-html="DateTxt(item)"></div>
    </Item>
  </AppPage>
</template>
<script>
  import Api from './api'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      ...mapActions(['setCountdown']),
      fetchData() {
        Api.loadCountdownList(this.groupId).then(res => {
          this.list = res.countDowns || []
        })
      },
      itemTxt(item) {
        return item.isExpired === 0 ? `${item.remindContent}（已结束）` : item.remindContent
      },
      DateTxt(item) {
        return DateUtils.format(item.remindTime, DateUtils.YMD)
      },
      handleCountdown(item) {
        this.setCountdown({ item: item })
        this.routePush({ name: 'detail1137' })
      }
    },
    mounted() {
      this.fetchData()
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      },
      $route(to, from) {
        if (to.path === '/vx/') {
          this.fetchData()
        }
      }
    }
  }
</script>
