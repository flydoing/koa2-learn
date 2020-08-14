<template>
  <div class="card-images"
       :class="{'single': this.single,'imgTwoToFour':images.length > 1 && images.length < 5,'imgFiveToNine':images.length >4}"
       v-if="images.length > 0"
       v-viewer.static>
    <slot>
      <div v-for="(image,i) in photos"
           :key="i">
        <template v-if="images.length === 1">
          <img :data-source="image.src"
               :src="Image.IMG_EMPTY"
               class="onePhoto"
               v-lazy:background-image="image.thumb"
               :style="imageStyle(image)"
               @click="onClick(image,$event)" />
        </template>
        <template v-else-if="images.length > 1 && images.length < 5">
          <img :data-source="image.src"
               :src="Image.IMG_EMPTY"
               class="twoToFourPhoto"
               v-lazy:background-image="image.thumb"
               :style="imageStyle(image)"
               @click="onClick(image,$event)" />
        </template>
        <template v-else>
          <img :data-source="image.src"
               v-lazy:background-image="image.thumb"
               :src="Image.IMG_EMPTY"
               :style="imageStyle(image)"
               @click="onClick(image,$event)" />
        </template>
      </div>
      <div class="image-more"
           v-if="images.length > 9"
           @click="showMore=!showMore">
        <span class="text-color">{{showMore ? '收起' : '更多'}}</span>
      </div>
    </slot>
  </div>
</template>
<script>
  export default {
    props: {
      images: {
        type: [Array],
        default: function() {
          return []
        }
      },
      single: {
        type: [Boolean],
        default: false
      },
      listenEvent: { type: Boolean, default: false }
    },
    data: function() {
      return {
        index: 0,
        showMore: false
      }
    },
    computed: {
      photos() {
        // 如果大于9张图，则只需展示8张图，然后展示更多
        if (this.showMore) {
          return this.images
        }
        return this.images.slice(0, this.images.length > 9 ? 8 : 9)
      }
    },
    methods: {
      imageStyle(img) {
        let style = {
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'background-position': 'center'
        }
        if (!img) {
          return style
        }
        let remark = img.remark ? JSON.parse(img.remark) : {}
        const maxWidth = 387
        const maxHeight = 297
        if (this.images.length === 1) {
          if (remark.thumb) {
            // 如果图片宽高都没有超过最大宽高,则用原来大小赋值
            if (remark.thumb.width < maxWidth && remark.thumb.height < maxHeight) {
              return {
                ...style,
                width: `${remark.thumb.width}px`,
                height: `${remark.thumb.height}px`
              }
            } else {
              // 如果图片宽高有一样超过最大宽或高，则按等比计算
              if (remark.thumb.width > remark.thumb.height) {
                return {
                  ...style,
                  width: `${remark.thumb.width}px`,
                  height: remark.thumb.height / (remark.thumb.width / maxWidth) + 'px'
                }
              } else {
                return {
                  ...style,
                  height: `${remark.thumb.height}px`,
                  width: remark.thumb.width / (remark.thumb.height / maxHeight) + 'px'
                }
              }
            }
          } else {
            return {
              ...style,
              width: `${maxWidth}px`,
              height: maxHeight / (maxWidth / maxWidth) + 'px'
            }
          }
        } else {
          return style
        }
      },
      onClick(img, e) {
        if (this.listenEvent) {
          this.$emit('callback', img)
          e.stopPropagation()
        }
      },
      handleQrCode(img) {
        this.$emit('qrcode', img)
        return false
      },
      prefixeClass: function() {
        return [
          'card-images',
          {
            single: this.images.length === 1
          }
        ]
      }
    }
  }
</script>
<style lang="scss">
  .card-images {
    width: rem(124 * 3+5 * 3);
    padding-top: nth($padding, 1);
    @extend %flex;
    @include jc(flex-start);
    @include wrap;
    &.single {
      img {
        width: auto;
        height: auto;
        max-width: rem(124 * 3 + 3 * 5);
        max-height: rem(94 * 3 + 3 * 5);
      }
    }
    div {
      position: relative;
      cursor: pointer;
      margin: rem(0) rem(5) rem(5) rem(0);
      background-color: nth($background, 2);
      &.image-more {
        width: rem(100);
        height: rem(100);
        text-align: center;
        line-height: rem(100);
      }
    }
    img {
      display: block;
    }
    .onePhoto {
      max-width: rem(124 * 3 + 3 * 5);
      max-height: rem(94 * 3 + 3 * 5);
    }
  }
  .imgTwoToFour {
    img {
      width: rem(186);
      height: rem(141);
    }
  }
  .imgFiveToNine {
    img {
      width: rem(124);
      height: rem(94);
    }
  }
</style>
