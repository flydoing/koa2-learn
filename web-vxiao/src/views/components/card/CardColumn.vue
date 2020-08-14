<template>
  <div class="vx-card com-table">
    <div class="com-cell vx-card-main">
      <div class="column-card" :class="{'pd': pd}">
        <div class="column-card-img" @click="cardClick">
          <img  alt='封面' :src="Image.IMG_EMPTY" v-lazy:background-image="url(m.medias[0].fileId)" :style="imageStyle(url(m.medias[0].fileId))" />
        </div>
          <div class="column-card-contents" @click="cardClick">
            <slot name="content">
              <div class="text-color">{{m.extensionType}}</div>
              <div class="text-gray" v-html="remarkTxt"></div>
              <div class="main" v-html="m.content"></div>
            </slot>
          </div>
          <slot name="down">
            <CardDown :m="message"></CardDown>
          </slot>
        </div>
      </div>
    </div>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      },
      pd: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      remarkTxt() {
        if (this.message.msgJson) {
          let mJson = JSON.parse(this.message.msgJson)
          return mJson.categorys.length > 0 ? mJson.categorys[0].name : ''
        }
        return ''
      }
    },
    methods: {
      cardClick(event) {
        this.$emit('click')
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~scss/_mixin";

  .vx-card-main {
    text-align: left;
    position: relative;
    padding: 0 !important;

    .column-card {
      height: rem(258);
      padding-left: rem(200) !important;
      position: relative;
      @include flex;
      word-wrap: break-word;
      word-break: break-all;
      cursor: pointer;

      &-img {
        position: absolute;
        left: rem(10);
        top: rem(10);

        img {
          width: rem(180);
          height: rem(238);
        }
      }

      &-contents {
        width: 100%;

        .text-gray {
          color: #9f9f9f;
          font-size: rem(12);
        }

        .main {
          @include lh(9);
          text-align: justify;
        }
      }

      &.pd {
        padding: rem(10);
      }
    }
  }

</style>
