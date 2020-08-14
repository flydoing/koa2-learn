<template>
  <page title="新建安全信息"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack
        @scrolling="scrolling">
    <div class="security-create"
         slot="top">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleColumn">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">栏目</div>
            <div slot="remark"
                 v-html="columnTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in columns"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">封面</div>
          <img slot="remark"
               class="s-img"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </item>
      </el-upload>
    </div>
    <div class="editor-item"
         v-if="maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="editorMessage"
                :height="maxHeight"
                placeholder="正文内容" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
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
        loading: null,
        columns: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      columnTxt() {
        return this.form.column ? this.form.column.name : ''
      },
      logo() {
        return this.form.cover ? this.url(this.form.cover.id) : ''
      }
    },
    methods: {
      fetchData() {
        const that = this
        CategoryApi.getCategorys({
          type: '116',
          groupId: that.currentGroup.groupId
        }).then(res => {
          that.columns = res.categorys
          if (!that.msgId) {
            that.form.column = res.categorys[0]
          }
        })
      },
      scrolling(status) {
        this.$children[0].$children[3].$children[0].$refs._toolbar.style.top = `${status.offset.y}px`
      },
      handleColumn(item) {
        this.form.column = item
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
        let style =
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">'

        let form = that.form
        if (!form.column) {
          that.$message({ message: '请选择栏目', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '正文内容不能为空', type: 'warning' })
          return false
        }

        let medias = that.editorMessage.medias
        if (form.cover) {
          let cover = form.cover
          medias.push({
            type: 'photo',
            fileName: cover.name,
            fileId: cover.id,
            size: cover.size,
            remark: cover.remark,
            status: 'h'
          })
        }

        let postData = that.constructionMessage({
          type: '1149',
          title: form.title,
          groupId: that.currentGroup.groupId,
          categoryId: form.column.id,
          categoryName: form.column.name,
          content: `${style}${that.editorMessage.content}</div></body></html>`,
          medias: medias
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.routeBack()
        })
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
  .security-create {
    .el-upload {
      display: block !important;
    }
    .s-img {
      height: rem(50);
      margin: rem(5) 0 rem(5) rem(5);
    }
  }

  .editor-item {
    padding-top: rem(64);
  }

  .editor-toolbars {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
  }
</style>
