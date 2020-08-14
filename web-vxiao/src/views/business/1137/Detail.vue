<template>
  <page title="倒计时详情">
    <item :hasClick="false">
      <div slot="main" v-html="cd.name"></div>
      <div slot="after"></div>
    </item>
    <item :hasClick="false">
      <div slot="main" v-html="cd.date"></div>
      <div slot="after"></div>
    </item>
    <item :hasClick="false">
      <div slot="main" v-html="cd.obj"></div>
      <div slot="after"></div>
    </item>
    <div class="button button-common" @click="handleRemove">删除</div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters } from 'vuex'
import DateUtils from '@/utils/date'

export default {
  mixins: [R],
  props: {},
  computed: {
    ...mapGetters({
      countdown: 'getCountdown'
    }),
    cd() {
      let item = this.countdown.item
      let obj = item.oriented ? `${item.oriented}年级学生` : '全体学生'
      return {
        name: `距离${item.remindContent}还有${item.remindDay}天`,
        date: `日期：${DateUtils.format(item.remindTime, 'yyyy年MM月dd日')}`,
        obj: `面向群体：${obj}`
      }
    }
  },
  methods: {
    handleRemove() {
      const that = this
      that.modifyMessage({ id: this.countdown.item.msgId, status: 'd', type: '1137' }).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    }
  }
}

</script>
