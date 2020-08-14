<template>
  <page title="选择周期">
    <item v-for="(item,i) in list" :key="i" @click="handleItem(item)">
      <div slot="main" v-html="item.remark"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'
import DateUtils from '@/utils/date'

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
      journal: 'getJournal'
    })
  },
  methods: {
    ...mapActions(['setJournal']),
    fetchData() {
      let date = new Date()
      for (let i = 0; i < 30; i++) {
        let sTime = DateUtils.getWeekDate(date, 'start')
        let eTime = DateUtils.getWeekDate(date, 'end')
        let s = sTime.getFullYear() > date.getFullYear()
        let e = eTime.getFullYear() > date.getFullYear()

        let time = {
          remark: `${DateUtils.format(sTime, s ? 'yyyy-MM-dd' : 'MM-dd')} 至 ${DateUtils.format(eTime, e ? 'yyyy-MM-dd' : 'MM-dd')}`,
          label: `${DateUtils.format(sTime, s ? 'yyyy.MM.dd' : 'MM.dd')} 至 ${DateUtils.format(eTime, e ? 'yyyy.MM.dd' : 'MM.dd')}`,
          data: [{
            setTime: DateUtils.format_0800(sTime),
            type: 'start'
          }, {
            setTime: DateUtils.format_0800(eTime),
            type: 'end'
          }]
        }
        this.list.push(time)
        date = new Date(date.setDate(date.getDate() + 7))
      }
    },
    handleItem(item) {
      this.setJournal({ time: item })
      this.routeBack()
    }
  }
}

</script>
