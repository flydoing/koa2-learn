<template>
  <div class="vx-card com-table">
    <div class="com-cell vx-card-main">
      <div class="card-title" style="font-weight: bold;" v-html="message.title"></div>
      <div class="content-box" v-html="message.content"></div>
      <CardImages :images="images" v-if="images.length>0"></CardImages>
      <CardFiles :files="files" v-if="files.length>0"></CardFiles>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        images: [],
        files: []
      }
    },
    created() {
      const medias = this.message.medias ? JSON.parse(JSON.stringify(this.message.medias)) : []
      medias.forEach(m => {
        if (m.type === 'photo') {
          m.src = this.url(m.fileId)
          m.thumb = this.url(m.fileId, 'thumb')
          this.images.push(m)
        } else {
          this.files.push(m)
        }
      })
    },
    components: {
      CardImages: resolve => require(['@/views/components/card/ui/Images'], resolve),
      CardFiles: resolve => require(['@/views/components/card/ui/Files'], resolve)
    }
  }

</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .vx-card {
    padding: rem(10);
    .vx-card-main {
      text-align: left;
    }
  }

  .vx-image {
    div {
      img {
        width: 100%;
      }
    }
  }

  .content-box {
    word-wrap: break-word;
    word-break: break-all;
  }

</style>
