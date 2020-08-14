<template>
  <Card :message="message"
        @detail="handleDetail"
        v-if="isOrg">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="editAble && (isAdmin || message.fromUserId == userId)"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <template slot="titles">
      <div v-if="jsonTxt.date"
           v-html="jsonTxt.date"></div>
      <div class="card-extension"
           v-if="jsonTxt.range"
           v-html="jsonTxt.range"></div>
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
             @click="onParticulars"></i>
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
              @click="onParticulars" />
  </Card>
  <Card v-else
        :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <div v-if="jsonTxt.date"
           v-html="jsonTxt.date"></div>
    </CardContent>
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
      editAble() {
        return this.message.msgType !== '3'
      },
      jsonTxt() {
        let mJson = this.message.msgJson ? JSON.parse(this.message.msgJson) : null
        if (mJson) {
          return {
            date: mJson.name || '',
            range: mJson.extension || ''
          }
        }
        return {}
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
      },
      onParticulars() {
        this.routePush({
          name: 'cardDetail',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      }
    }
  }
</script>
<style lang="scss">
  .card-extension {
    @include lh(1);
  }
</style>
