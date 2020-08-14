<template>
  <Card :message="msg">
    <CardContent slot="content"
                 :content="m.content">
    </CardContent>
    <div v-lazy:background-image="bg"
         class="video-conferencing"
         @click="handleMeetingAudience(msg)"></div>
  </Card>
</template>
<script>
import CardMixin from '@/views/components/card/mixin'
import DateUtils from '@/utils/date'
import Check from '@/utils/check'

export default {
  mixins: [CardMixin],
  props: {
    message: { type: [Object] }
  },
  components: {},
  data() {
    return {
      msg: { ...this.message, readed: this.message.readed || 0 }
    }
  },
  computed: {
    m() {
      let _m = this.converMessage(this.msg)
      if (Check.isArray(_m.addressDates)) {
        let ad = _m.addressDates[0]
        _m.sTime = DateUtils.format(ad.startTime, DateUtils.MDHM)
        _m.content = `会议名称：${_m.title}<br>开始时间：${_m.sTime}<br>会议简介：${_m.content}`
      }
      return _m
    },
    bg() {
      return '/static/live_.png'
    }
  },
  methods: {
    handleMeetingAudience(msg) {
      // 创建人：提醒在客户端打开
      if (this.baseInfo.USERID === msg.fromUserId) {
        this.$message({ message: '视频会议创建人，请在客户端打开', type: 'warning' })
        return
      }
      let roomid = msg.originalId || msg.id // 消息的：originalId或消息id
      this.routePushModel({
        name: `meetingAudience1293`,
        query: {
          groupId: msg.groupId,
          roomid: roomid,
          meetingTitle: msg.title,
          fromUserId: msg.fromUserId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-conferencing {
    width: rem(354);
    height: rem(200);
    position: relative;
    margin-top: rem(5);
    cursor: pointer;
    background: #666666;
    color: #ffffff;
  }
</style>
