<template>
  <page title="选择会议地点">
    <item v-for="(item,i) in list" :key="i" @click="handleItem(item, i)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-if="item.status=='2'" class="text-color error">已有预定</div>
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
    })
  },
  methods: {
    ...mapActions(['setMeeting']),
    fetchData() {
      const that = this
      let sTime = DateUtils.format(that.meeting.startTime, 'yyyyMMddhhmm')
      let eTime = DateUtils.format(that.meeting.endTime, 'yyyyMMddhhmm')
      Api.getPlaces(this.currentGroup.parentId, sTime, eTime).then(res => {
        that.list = res.rooms
      })
    },
    handleItem(item, index) {
      this.setMeeting({ place: item })
      if (item.status === '2') {
        this.routePush({ name: 'placeReserveList1040' })
      } else {
        this.routeBack()
      }
    }
  }
}

</script>
