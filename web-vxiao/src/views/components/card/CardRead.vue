<template>
  <div class="vx-card com-table vx-card-read">
    <div class="vx-card-main com-cell">
      <div class="card-header">
        <div v-html="m.title"></div>
        <slot name="down">
          <CardDown :m="message"></CardDown>
        </slot>
      </div>
      <card-href :content="m.hrefText"
                 @click="handleHref"></card-href>
      <div v-if="flag">
        <template v-if="flag.keyWords">
          <div class="card-flag text-color"
               v-for="f in flag.keyWords"
               :key="f">{{f}}</div>
        </template>
      </div>
      <card-content :content="m.content"
                    :more="false"></card-content>
      <card-images :images="m.images"></card-images>
      <card-files :files="m.files"></card-files>
      <card-href content="立即阅读"
                 @click="handleHrefDetail"></card-href>
      <card-counter v-on:reply="handleReply"
                    v-on:praise="handlePraise"
                    :counter="m.counter">
        <span></span>
      </card-counter>
      <card-reply-input :show.sync="showInput"
                        :u="replyUser"></card-reply-input>
      <div class="card-reply-list">
        <card-praise :praises="m.praises"></card-praise>
        <card-reply :r="r"
                    v-for="(r,i) in m.replys"
                    :key="i"></card-reply>
      </div>
    </div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    name: 'CardRead',
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        flag: {}
      }
    },
    computed: {
      m() {
        const that = this
        let _m = this.converMessage(this.message)
        _m.title = `${this.message.businessName}：${this.message.title}`
        _m.hrefText = this.message.categoryName
        try {
          const json = JSON.parse(this.message.msgJson)
          if (!Check.isNullObject(json)) {
            that.flag = json
          }
        } catch (e) {}
        return _m
      }
    },
    methods: {
      handleHrefDetail() {
        this.$emit('click')
      }
    }
  }
</script>
<style lang="scss">
  .vx-card-read {
    .vx-card-main {
      padding-left: nth($padding, 3) !important;
    }
    .card-flag {
      margin: rem(5) nth($padding, 1) rem(5) 0;
      padding: rem(0) nth($padding, 3);
      display: inline-block;
      line-height: rem(20);
      border-radius: rem(20);
      border: $border;
      cursor: pointer;
      font-size: rem(12);
      &:hover {
        background: nth($background, 2);
      }
    }
  }
</style>
