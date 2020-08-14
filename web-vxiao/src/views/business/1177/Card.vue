<template>
  <Card :message="message"
        :parentType="1176"
        @detail="handleDetail">
    <CardDown slot="down"
              :m="msg">
      <el-dropdown-item v-if="isAdmin"
                        @click.native.stop="handleOvert">{{overtTxt}}</el-dropdown-item>
    </CardDown>
    <template slot="toolbar">
      <div class="card-counter">
        <div class="counter text-label left">已阅{{message.readCount}}</div>
        <div class="counter right">
          <span>
            <i :class="icoPraise"
               @click="handlePraise"></i>
            <span class="number f12"
                  v-if="praises.length > 0">{{praises.length}}</span>
          </span>
          <i class="ico ico-reply"
             @click="onParticulars"></i>
        </div>
      </div>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        msg: this.message
      }
    },
    computed: {
      overtTxt() {
        return this.msg.isPrivate !== '1' ? '取消公开' : '对外公开'
      },
      praises() {
        // 判断praise 中isPraise 为1状态的数据
        let _praises = this.message.praises || []
        return _praises.filter((p) => {
          return p.isPraise === 1
        })
      },
      icoPraise() {
        let _praises =
          this.praises.filter((p) => {
            return p.userId === this.userId
          }) || []
        return [
          `ico`,
          {
            [`ico-heart`]: _praises.length === 0,
            [`ico-heart-press`]: _praises.length > 0
          }
        ]
      }
    },
    methods: {
      handleOvert() {
        let m = { ...this.msg, isPrivate: this.msg.isPrivate !== '1' ? '1' : '0' }
        this.modifyMessage(m).then((message) => {
          this.$message({ message: '操作成功', type: 'success' })
          this.$set(this.msg, message)
        })
      },
      handleDetail() {
        this.routePushModel({
          name: 'cardDetail',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      },
      onParticulars() {
        this.routePushModel({
          name: 'cardDetail',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      }
    }
  }
</script>
