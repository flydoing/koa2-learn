<template>
  <Card :message="message">
    <CardHref slot="category"
              :content="message.categoryName"
              @click="handleHref" />
    <CardHref slot="href"
              :content="btnText"
              @click="handleHrefDetail" />
    <template slot="counter">
      <span v-if="counter.showCounter">{{counter.label}}{{counter.readCount}}</span>
      <span v-else></span>
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
    computed: {
      btnText() {
        return this.isTeacher || this.message.readed === 1 ? '查看详情' : '立即诵读'
      },
      counter() {
        return {
          label: '已诵读',
          readCount: this.message.readCount,
          showCounter: this.message.readCount > 0
        }
      }
    },
    methods: {
      handleHrefDetail() {
        this.routePushModel({
          name: 'chantDetail1186',
          query: {
            msgId: this.message.id,
            appType: this.message.type
          }
        })
      }
    }
  }
</script>
<style></style>
