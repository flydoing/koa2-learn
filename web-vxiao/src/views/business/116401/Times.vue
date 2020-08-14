<template>
  <page title="考试时间">
    <item v-for="(item,i) in arrange.times" :key="i" :item="item" :hasClick="false">
      <div slot="main" v-html="item.subjectName"></div>
      <div slot="remark" class="ellipsis" v-html="itemTxt(item)"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import DateUtils from '@/utils/date'
import { mapGetters } from 'vuex'

export default {
  mixins: [R],
  props: {},
  computed: {
    ...mapGetters({
      arrange: 'getArrangeExam'
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    itemTxt(item) {
      return `${DateUtils.format(item.startDate, 'yyyy年MM月dd日 hh:mm')} - ${DateUtils.format(item.endDate, 'yyyy年MM月dd日 hh:mm')}`
    }
  }
}

</script>
