<template>
  <Page title="倒计时" @add="handleAdd" :hasAdd="true">
    <item v-for="(item,i) in list" :key="i" :item="item" @click="handleCountdown(item)">
      <div slot="main" v-html="itemTxt(item)"></div>
      <div slot="remark" class="ellipsis" v-html="DateTxt(item)"></div>
    </item>
  </Page>
</template>
<script>
import DateUtils from '@/utils/date'
import { mapActions } from 'vuex'
import Api from './api'
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  components: {},
  data() {
    return {
      list: []
    }
  },
  activated() {
    Api.loadCountdownList(this.currentGroup.groupId).then(res => {
      this.list = res.countDowns
    })
  },
  methods: {
    ...mapActions(['setCountdown']),
    itemTxt(item) {
      return item.isExpired === 0 ? `${item.remindContent}（已结束）` : item.remindContent
    },
    DateTxt(item) {
      return DateUtils.format(item.remindTime, DateUtils.YMD)
    },
    handleCountdown(item) {
      this.setCountdown({ item: item })
      this.routePush({ name: 'detail1137' })
    },
    handleAdd() {
      this.routePush({ name: 'addCountdown1137' })
    }
  }
}

</script>
