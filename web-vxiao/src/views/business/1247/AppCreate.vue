<template>
  <page :title="title"
        :listenBack="true"
        :hasSubmit="true"
        @back="back"
        @submit="submitHandle">
    <div class="content-manage-create">
      <item @click="selectGrade">
        <div>适用年级</div>
        <div slot="remark"
             class="ellipsis">{{gradeTexts()}}</div>
      </item>
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="contentManage.title" />
      </item>
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">封面</div>
          <img slot="remark"
               class="a-img"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </item>
      </el-upload>
      <div class="editor-item">
        <keep-alive>
          <Editor :store.sync="editorMessage"
                  placeholder="内容"
                  ref="_editor" />
        </keep-alive>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
    },
    data() {
      return {
        contentManage: {
          title: '',
          grades: [],
          cover: null
        },
        editorMessage: {},
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}</style></head><body><div class="ql-editor">',
        loading: null
      }
    },
    computed: {
      ...mapGetters({
        cacheConten: 'getContentManage'
      }),
      title() {
        return this.routeQuery('msgId') ? '编辑内容' : '新建内容'
      },
      logo() {
        return this.contentManage.cover ? this.url(this.contentManage.cover.id || this.contentManage.cover.fileId) : ''
      }
    },
    activated() {
      this.initDate()
    },
    methods: {
      ...mapActions(['saveContentManage', 'clearContentManage']),
      initDate() {
        if (this.cacheConten.hasCache) {
          this.contentManage = JSON.parse(JSON.stringify(this.cacheConten))
        }
      },
      selectGrade() {
        this.saveContentManage({
          ...this.contentManage,
          hasCache: true
        })
        this.routePushModel({
          name: 'selectGarade1247'
        })
      },
      uploadSuccess(res) {
        this.contentManage.cover = {
          fileName: res.file.name,
          status: '2',
          extension: res.file.extension,
          size: res.file.size,
          fileId: res.file.id,
          type: 'photo',
          remark: res.file.remark || void 0
        }
        this.loading.close()
      },
      beforeUpload() {
        this.loading = this.$loading({ target: this.$el })
      },
      gradeTexts() {
        let arr = []
        this.contentManage.grades.length > 0 &&
          this.contentManage.grades.forEach(grade => {
            arr.push(grade.name)
          })
        return arr.join('，')
      },
      submitHandle() {
        const that = this
        if (that.contentManage.grades.length === 0) {
          that.$message({ type: 'warning', message: '适用年级不能为空' })
          return false
        }
        if (that.contentManage.title === '') {
          that.$message({ type: 'warning', message: '标题不能为空' })
          return false
        }
        if (!that.contentManage.cover) {
          that.$message({ type: 'warning', message: '封面不能为空' })
          return false
        }
        if (!that.editorMessage.content) {
          that.$message({ type: 'warning', message: '内容不能为空' })
          return false
        }
        let gradeIds = []
        that.contentManage.grades.forEach(g => {
          gradeIds.push(g.id)
        })
        that
          .addMessage({
            groupId: that.currentGroup.groupId,
            title: that.contentManage.title,
            type: '1247',
            content: `${that.style}${that.editorMessage.content}</div></body></html>`,
            msgJson: JSON.stringify({ categoryIds: [...gradeIds] }),
            medias: [this.contentManage.cover, ...that.editorMessage.medias],
            ...that.constructionMessage()
          })
          .then(res => {
            that.clearContentManage()
            this.routeBack()
            that.$message({ type: 'success', message: '成功' })
          })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearContentManage()
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .content-manage-create {
    .el-upload {
      display: block !important;
    }
    .a-img {
      height: rem(50);
      margin: rem(5) 0 rem(5) rem(5);
    }
  }
</style>
