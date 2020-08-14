<template>
  <Card :message="message"
        v-if="isOrg">
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
  </Card>
  <Card v-else
        :message="message">
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
    computed: {
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
<style lang="scss">
  .card-extension {
    @include lh(1);
  }
</style>
