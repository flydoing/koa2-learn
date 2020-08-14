<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || message.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <template slot="content">
      <div>活动主题：{{message.title}}</div>
      <div>截止时间：{{dateTxt}}</div>
    </template>
    <CardHref content="查看详情"
              @click="handle"></CardHref>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    computed: {
      dateTxt() {
        if (Check.isRealArray(this.message.times)) {
          let date = this.message.times[0]
          return DateUtils.format(date.setTime, 'yyyy年MM月dd日 hh：mm')
        }
        return ''
      }
    },
    methods: {
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/message/edit',
          query: {
            msgId: this.message.id,
            title: this.message.businessName
          }
        })
      },
      handle() {
        this.routePushModel({
          name: 'detail1169',
          query: { msgId: this.message.id }
        })
      }
    }
  }
</script>
