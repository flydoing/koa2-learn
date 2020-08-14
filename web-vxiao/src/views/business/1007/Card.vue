<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || m.fromUserId == userId"
                        @click.native.stop="handleModifyDeadline">修改截止时间</el-dropdown-item>
    </CardDown>
    <div slot="href"
         class="text-color">
      <span @click="handleDetail(true)">查看详情</span>
      <template v-if="!joinIn">
        &nbsp;|&nbsp;
        <span @click="handleDetail(false)">参与投票</span>
      </template>
    </div>
    <template slot="counter">
      <span>已答 {{message.readCount || 0}}</span>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {},
    computed: {
      joinIn() {
        return this.message.readed === 1
      }
    },
    methods: {
      handleDetail(value) {
        let mJson = JSON.parse(this.message.msgJson || '{}')
        this.routePushModel({
          name: 'detail1042',
          params: {
            msgId: this.message.id
          },
          query: {
            joinIn: value ? 1 : 0,
            upperLimit: mJson.maxValue || 1,
            title: '投票详情',
            appType: '1007'
          }
        })
      },
      handleModifyDeadline() {
        this.routePushModel({
          name: 'modifyDeadline1042',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
