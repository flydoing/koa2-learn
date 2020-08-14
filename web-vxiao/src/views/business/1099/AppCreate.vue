<template>
  <Page title="新建动态"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="拜访对象"
          :remark="objTxt"
          @click="handleObject"></item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          object: null,
          type: '1084'
        }
      }
    },
    activated() {
      let agent = this.crm.agent
      if (agent) {
        this.form.object = agent
        this.form.type = '1088'
        this.deleteCrmProp('agent')
      }
      let customer = this.crm.customer
      if (customer) {
        this.form.object = customer
        this.form.type = '1084'
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      objTxt() {
        let obj = this.form.object || {}
        return obj.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      handleObject() {
        this.routePush({
          path: '/vx/group/business/1046/selectObject',
          query: {
            title: '拜访对象'
          }
        })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.object) {
          that.$message({ message: '拜访对象不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(editor.content)) {
          that.$message({ message: '动态内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: form.type,
          groupId: that.groupId,
          ...editor
        })
        if (form.type !== '1084') {
          postData.msgJson = JSON.stringify({
            object: {
              agentId: form.object.id
            }
          })
        } else {
          postData.clientId = form.object.id
        }
        that.addMessage(postData).then(res => {
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
