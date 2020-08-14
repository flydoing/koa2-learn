<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item slot="top"
          label="改动通知已阅人员">
      <div slot="after">
        <i-switch :value="isNotify"
                  @click="handleNotify"></i-switch>
      </div>
    </item>
    <template v-if="isRichTxt && editorMessage && maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="editorMessage"
                placeholder="动态内容"
                :height="maxHeight"
                ref="_editor" />
      </keep-alive>
    </template>
    <template v-else>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="[]" />
      </keep-alive>
    </template>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve),
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
    },
    data() {
      return {
        notify: '',
        maxHeight: 0,
        message: null,
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">'
      }
    },
    computed: {
      msgId() {
        return this.routeQuery('msgId')
      },
      title() {
        return `编辑${this.routeQuery('title') || ''}`
      },
      isRichTxt() {
        return this.routeQuery('rich') !== undefined
      },
      isNotify() {
        return this.notify === '1'
      }
    },
    created() {
      this.editorMessage = null
      MessageApi.getMessageById(this.msgId).then(res => {
        let m = res.message || {}
        this.editorMessage = {
          content: m.htmlContent ? m.htmlContent.replace(this.style, '').replace('</div></body></html>', '') : m.content || '',
          medias: this.isRichTxt ? m.medias || [] : []
        }
        this.message = res.message
      })
    },
    methods: {
      handleNotify() {
        this.notify = this.notify === '1' ? '0' : '1'
      },
      handleSubmit() {
        const that = this
        let editor = this.editorMessage
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = {
          id: this.message.id,
          groupId: this.message.groupId,
          content: that.isRichTxt ? `${that.style}${editor.content}</div></body></html>` : editor.content,
          notifyOnModify: this.notify
        }

        if (this.isRichTxt) {
          postData.medias = editor.medias
        }

        this.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .share-create {
    textarea {
      height: rem(100);
      border-bottom: rem(1) solid #ededed;
    }
  }
</style>
