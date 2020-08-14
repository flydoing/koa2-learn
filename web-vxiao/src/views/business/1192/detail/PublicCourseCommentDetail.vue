<template>
  <page title="评课" :hasClose="false">
    <div class="public-child-detail">
      <item :hasClick="false">
        <div>总分</div>
        <div slot="remark" v-if="total">{{total}}</div>
      </item>
      <div class="public-child-detail-Item" v-if="commentItem.length>0" v-for="(item, i) in commentItem" :key="i">
        <div class="category-title text">{{item.name}}</div>
        <item v-for="(childItem, c) in item.childs" v-if="item.childs.length>0" :key="c" :hasClick="false">
          <div slot="main">{{childItem.serialNumber}} {{childItem.name}}</div>
          <div slot="remark">{{childItem.value}}分</div>
        </item>
      </div>
      <div class="p10">
        <div class="public-child-detail-descript" v-if="descriptContent">{{descriptContent}}</div>
        <CardImages v-if="descriptImages.length>0" :images="descriptImages"></CardImages>
        <CardFiles v-if="descriptFiles.length>0" :files="descriptFiles"></CardFiles>
      </div>
    </div>
  </page>
</template>
<script>
  import Media from '@/constant/media'
  import CardMixin from '@/views/components/card/mixin'
  import Api from '../api'
  export default {
    mixins: [CardMixin],
    data() {
      return {
        commentItem: [],
        descriptContent: '',
        descriptFiles: [],
        descriptImages: [],
        total: 0
      }
    },
    created() {
      let that = this
      Api.getCommentDetail(that.routeQuery('msgId')).then(res => {
        if (res && res.code === '1') {
          that.commentItem = res.categorys
          that.commentItem.forEach(v => {
            v.childs && v.childs.forEach(child => {
              this.total += Number(child.value)
            })
          })
          that.descriptContent = res.content || ''
          res.medias && res.medias.length > 0 && that.formatImageOrFile(res.medias, that.descriptImages, that.descriptFiles)
        }
      })
    },
    methods: {
      formatImageOrFile(medias, imgArr, fileArr) {
        let that = this
        medias.forEach((m, i) => {
          if (m.type === Media.PHOTO) {
            imgArr.push({
              thumb: that.url(m.fileId, 'thumb'),
              src: that.url(m.fileId),
              ...m
            })
          } else {
            let href = that.url(m.fileId)
            // 在线预览附件
            if ('doc/docx/xls/xlsx/ppt/pptx/pdf'.indexOf(m.extension) >= 0) {
              href = `${this.$store.state.FILE_URL}/view/${m.fileId}`
            }
            fileArr.push({
              href: href,
              sizeText: Media.size(m.size),
              ...m
            })
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .public-child-detail {
    .p10 {
      padding: rem(10);
    }
  }

</style>
