<template>
  <Card :message="message"
        @detail="handleDetail">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || message.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <template slot="titles">
      <div v-if="inscriptionTxt">{{inscriptionTxt}}</div>
    </template>
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
             @click="handleDetail"></i>
          <span class="number f12"
                v-if="message.reviewCount > 0">{{message.reviewCount}}</span>
        </div>
      </div>
    </template>
    <CardImages slot="images"
                :images="m.images"
                v-if="m.images.length>0"></CardImages>
    <CardHref v-if="button"
              slot="href"
              :content="button.text"
              @click="handleDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        msg: this.message
      }
    },
    computed: {
      inscription() {
        if (this.m.msgJson) {
          return JSON.parse(this.m.msgJson).signature
        }
        return false
      },
      inscriptionTxt() {
        return this.inscription ? `落款：${this.inscription.groupName || this.inscription.name}` : ''
      },
      button() {
        return {
          text: '查看详情',
          handle: this.detailHanle
        }
      },
      praises() {
        // 判断praise 中isPraise 为1状态的数据
        let _praises = this.message.praises || []
        return _praises.filter(p => {
          return p.isPraise === 1
        })
      },
      icoPraise() {
        let _praises =
          this.praises.filter(p => {
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
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/message/edit',
          query: {
            rich: 1,
            msgId: this.message.id,
            title: this.message.businessName
          }
        })
      },

      handleDetail() {
        this.routePushModel({
          name: 'cardDetail',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .number {
    color: #9f9f9f;
  }
  span:hover {
    cursor: pointer;
  }
</style>
