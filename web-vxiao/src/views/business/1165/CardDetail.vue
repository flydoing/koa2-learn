<template>
  <CardDetail :m="msg"
              v-if="msg">
    <Card :message="msg"
          v-if="msg">
      <CardDown slot="down"
                :m="msg">
        <template slot="dropItem">
          <el-dropdown-item v-if="isAdmin || msg.fromUserId == userId"
                            @click.native.stop="handleEdit">编辑</el-dropdown-item>
          <el-dropdown-item v-if="isAdmin || msg.fromUserId == userId"
                            @click.native.stop="handleRemove">删除</el-dropdown-item>
        </template>
      </CardDown>
      <div slot="title"
           v-html="msg.title"></div>
      <template slot="toolbar">
        <CardCounter @readed="handleReaded"
                     @praise="handlePraise"
                     :counter="msg.counter">
          <slot name="counter">
            <i class="ico ico-private"
               v-if="msg.isPrivate"></i><span>{{msg.counter.label}} {{msg.counter.readCount || 0}}</span>
          </slot>
        </CardCounter>
      </template>
    </Card>
    <template slot="operate"></template>
  </CardDetail>
</template>
<script>
  import Api from '@/api/message'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    components: {
      CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve)
    },
    data() {
      return {
        msg: null
      }
    },
    computed: {},
    created() {
      Api.getMessageById(this.routeParam('msgId')).then(res => {
        this.msg = this.converMessage(res.message)
      })
    },
    methods: {
      handleEdit() {
        let m = this.msg
        this.routePushModel({
          path: '/vx/group/business/message/edit',
          query: {
            msgId: m.id,
            title: m.businessName
          }
        })
      },
      handleRemove() {
        this.$confirm('确定删除该消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.modifyMessage({
            ...this.msg,
            status: 'd'
          }).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
