<template>
  <div class="reply-item has-click"
       @click.stop="handle"
       v-viewer.static>
    <span class="text-color"
          @click.stop="$emit('user',r.fromUserId)">{{r.fromUserName}}</span>
    <span v-if="r.userName && r.userName!=''">回复</span>
    <span class="text-color"
          @click.stop="$emit('user',r.userId)"
          v-if="r.userName && r.userName!=''">{{r.userName}}</span>
    <span>：</span>
    <span class="text-color ri-image-item"
          v-if="r.medias">查看图片<img v-for="(image, i) in initImages(r.medias)"
           :key="i"
           :data-source="image.src"
           v-lazy:background-image="image.thumb"
           :src="Image.IMG_EMPTY"
           :style="imageStyle(image)" /></span>
    <span v-else
          v-html="replyContent()"></span>
    <i class="ico ico-dustbin"
       @click="handleRemove"
       v-if="r.fromUserId === USER.id"></i>
  </div>
</template>
<script>
  export default {
    props: {
      r: { type: Object },
      index: { type: Number, default: 0 }
    },
    methods: {
      initImages(medias) {
        if (medias.length > 0) {
          return medias.map(v => {
            return {
              ...v,
              thumb: v.thumb ? this.url(v.thumb) : this.url(v.fileId, 'thumb'),
              src: this.url(v.fileId)
            }
          })
        }
        return []
      },
      handle() {
        this.$emit('reply', this.r)
      },
      handleImage() {},
      handleRemove() {
        this.$emit('remove', this.r, this.index)
      },
      replyContent() {
        return this.converContent(this.r.content)
      }
    }
  }
</script>
<style lang="scss">
  .reply-item {
    &:hover {
      .ico-dustbin {
        display: inline-block;
      }
    }
    .ico-dustbin {
      display: none;
    }
    .ri-image-item {
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
        left: 0;
        top: 0;
      }
    }
  }
</style>
