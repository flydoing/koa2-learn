<template>
  <page :title="title">
    <item v-for="(item,i) in list" :key="i" :hasClick="false">
      <div slot="main" v-html="itemTxt(item)"></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
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
      meeting: 'getMeeting'
    }),
    title() {
      return this.place ? this.place.name : ''
    }
  },
  methods: {
    ...mapActions(['setMeeting']),
    fetchData() {
      const that = this
      that.place = that.meeting.place
      Api.getPlaceReserveList(that.place.id).then(res => {
        that.list = res.addressDates
      })
      that.setMeeting({ place: null })
    },
    itemTxt(item) {
      let sDate = new Date(DateUtils.format(item.startTime, DateUtils.YMD)).getTime()
      let eDate = new Date(DateUtils.format(item.endTime, DateUtils.YMD)).getTime()
      if (sDate === eDate) {
        return `${DateUtils.format(item.startTime, DateUtils.YMD_HM)} 至 ${DateUtils.format(item.endTime, DateUtils.HM)}`
      }
      return `${DateUtils.format(item.startTime, DateUtils.YMD_HM)} 至 ${DateUtils.format(item.endTime, DateUtils.YMD_HM)}`
    }
  }
}

</script>
