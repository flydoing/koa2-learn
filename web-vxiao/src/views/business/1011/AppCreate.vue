<template>
  <page :title="title"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack
        @scrolling="scrolling">
    <div class="active-create"
         slot="top">
      <el-popover placement="bottom-end"
                  width="432"
                  trigger="click"
                  v-model="showColumn">
        <SelectColumn :columns="columns"
                      @change="handleColumn"></SelectColumn>
        <item slot="reference">
          <div slot="main">栏目</div>
          <div slot="remark"
               v-html="columnTxt"></div>
        </item>
      </el-popover>
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <el-upload :action="uploadURL"
                 :data="{'cover':1}"
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
    </div>
    <div class="editor-item"
         v-if="editorMessage && maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="editorMessage"
                placeholder="动态内容"
                :height="maxHeight"
                ref="_editor" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import Api from './api'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve),
      SelectColumn: resolve => require(['./SelectColumn'], resolve)
    },
    data() {
      return {
        form: {
          title: '',
          column: null,
          cover: null,
          content: '',
          medias: []
        },
        maxHeight: 0,
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">',
        loading: null,
        columns: [],
        showColumn: false,
        message: null
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.msgId ? '编辑动态' : '新建动态'
      },
      columnTxt() {
        return this.form.column ? this.form.column.name : ''
      },
      logo() {
        return this.form.cover ? this.url(this.form.cover.fileId || this.form.cover.id) : ''
      }
    },
    methods: {
      fetchData() {
        const that = this
        that.msgId = that.routeQuery('msgId')
        if (that.msgId) {
          that.editorMessage = null
          MessageApi.getMessageById(that.msgId).then(res => {
            let m = res.message
            that.form.title = m.title
            that.form.column = { id: m.categoryId, name: m.categoryName || m.businessName }

            let cover = null
            let medias = []
            if (Check.isRealArray(m.medias)) {
              m.medias.map(v => {
                v.status === '2' && v.type === 'photo' ? (cover = v) : medias.push(v)
              })
            }
            that.form.cover = cover
            that.editorMessage = {
              content: m.htmlContent ? m.htmlContent.replace(that.style, '').replace('</div></body></html>', '') : m.content,
              medias: medias
            }
            that.message = m
          })
        }
        Api.getSecondColumns(this.currentGroup.groupId).then(res => {
          this.columns = res.categorys
          if (!that.msgId) {
            this.form.column = res.categorys[0]
          }
        })
      },
      scrolling(status) {
        this.$children[0].$children[3].$children[0].$refs._toolbar.style.top = `${status.offset.y}px`
      },
      handleColumn(item) {
        this.form.column = item
        this.showColumn = false
      },
      uploadSuccess(res, file, fileLlist) {
        this.form.cover = res.file
        this.loading.close()
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 5
        if (!limit1M) {
          this.$message({ message: '上传头像图片大小不能超过 5MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = this.$loading({
          text: '上传中',
          background: 'rgba(255, 255, 255, .3)'
        })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '动态内容不能为空', type: 'warning' })
          return false
        }

        let medias = []
        if (form.cover) {
          let cover = form.cover
          medias.push({
            type: 'photo',
            fileName: cover.name || cover.fileName,
            fileId: cover.fileId || cover.id,
            size: cover.size,
            remark: cover.remark,
            status: '2'
          })
        }

        if (Check.isRealArray(this.editorMessage.medias)) {
          this.editorMessage.medias.map(v => {
            let media = { ...v }
            delete media.id
            delete media.msgId
            if (media.type === 'photo') {
              media.status = 'h'
            }
            medias.push(media)
          })
        }

        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1011',
          title: form.title,
          groupId: that.currentGroup.groupId,
          content: `${that.style}${this.editorMessage.content}</div></body></html>`,
          isComment: 1,
          medias: medias
        })

        if (form.column) {
          postData.categoryId = form.column.id
          postData.categoryName = form.column.name
        }

        if (that.message) {
          postData.id = that.message.id
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            this.editorMessage = {}
            that.routeBack()
          })
        } else {
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            this.editorMessage = {}
            this.routeBack()
          })
        }
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .active-create {
    .el-upload {
      display: block !important;
    }

    .a-img {
      height: rem(50);
      margin: rem(5) 0 rem(5) rem(5);
    }
  }
</style>
