<template>
  <page title="考试科目信息"
        closePrompt>
    <item v-for="(item, i) in subjects"
          :key="i"
          :hasClick="false">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="dateTxt(item)"></div>
    </item>

  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import DateUtils from '@/utils/date'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        subjects: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      dateTxt(subject) {
        return `${DateUtils.format(subject.startTime, 'yyyy年MM月dd日 hh:mm')} - ${DateUtils.format(subject.endTime, 'hh:mm')}`
      },
      fetchData() {
        this.subjects = this.arrange.subjects || []
      }
    }
  }
</script>
