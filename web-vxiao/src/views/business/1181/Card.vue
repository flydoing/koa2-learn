<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <div v-if="flag">
        <template v-if="flag.keyWords">
          <div class="card-flag text-color"
               v-for="f in flag.keyWords"
               :key="f">{{f}}</div>
        </template>
      </div>
    </CardContent>
    <card-href content="立即阅读"
               @click="onHrefDetail"></card-href>
  </Card>
</template>
<script>
  import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      flag() {
        try {
          const json = JSON.parse(this.message.msgJson)
          if (!Check.isNullObject(json)) {
            return json
          }
        } catch (e) {}
        return {}
      }
    },
    methods: {
      onHrefDetail() {
        this.routePushModel({
          name: 'detailIndex1181',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .card-flag {
    font-size: rem(12);
    margin: rem(5) rem(5) rem(5) 0;
    padding: rem(0) nth($padding, 3);
    display: inline-block;
    line-height: rem(25);
    border-radius: rem(20);
    border: $border;
    cursor: pointer;
    &:hover {
      background: nth($background, 2);
    }
  }
