<template>
  <Page title="新建分享"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <label slot="btn"
           @click="handleSaveDraft">存草稿</label>
    <div class="category-title template"
         @click="handleMsgTemplate"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <item @click="handleAudit"
          label="推荐到班牌">
      <div slot="after">
        <i-switch :value.sync='shareScreen'
                  :trueValue="1"
                  :falseValue="0"></i-switch>
      </div>
    </item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
    </keep-alive>
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
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        count: '',
        shareScreen: 0
      }
    },
    activated() {
      let msgTmp = this.getStorage('_message_template_cache')
      let shareScreen = this.getStorage('_1068_shareScreen_cache')
      if (msgTmp) {
        this.shareScreen = parseInt(msgTmp.recommend)
        this.editorMessage = {
          content: msgTmp.content,
          medias: msgTmp.medias
        }
      } else {
        this.shareScreen = shareScreen || this.shareScreen
      }
    },
    created() {
      this.getTemplatesCount()
    },
    computed: {},
    methods: {
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1068').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      handleSubmit() {
        const that = this
        let editor = this.editorMessage
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '分享内容不能为空', type: 'warning' })
          return false
        }
        // 判断开关状态，推荐V屏需要上传图片
        if (this.shareScreen === 1) {
          // 判断是否有图片
          // message.medias,fileId
          if (Check.isNullArray(editor.medias)) {
            that.$message({ message: '请先上传图片', type: 'warning' })
            return false
          }
        }
        let postData = that.constructionMessage({
          type: '1068',
          groupId: that.groupId,
          recommend: this.shareScreen,
          ...editor
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleAudit() {
        this.shareScreen = !this.shareScreen
      },
      handleMsgTemplate() {
        this.setStorage('_1068_shareScreen_cache', this.shareScreen)
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1068'
          }
        })
      },
      handleSaveDraft() {
        const that = this
        let editor = this.editorMessage
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '分享内容不能为空', type: 'warning' })
          return false
        }
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1068',
          type: '1',
          message: that.constructionMessage({
            type: '1068',
            groupId: that.groupId,
            recommend: this.shareScreen,
            content: editor.content,
            medias: editor.medias || []
          })
        }

        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
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
<style lang="scss">
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
