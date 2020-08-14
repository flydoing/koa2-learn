<template>
  <Page title="新建留言寄语"
        closePrompt
        hasSubmit
        listenBack
        @back="back"
        @submit="handleSubmit">
    <Item :hasClick="!isOrg"
          @click="handleObject">
      <div>留言给</div>
      <div slot="remark"
           v-html="userTxt"></div>
    </Item>
    <TextInput placeholder="输入留言内容（150字以内）"
               :max="150"
               v-model="form.content" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve)
    },
    data() {
      return {
        form: {
          content: '',
          user: null
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        leaveWord: 'getCreateObject'
      }),
      userTxt() {
        return this.form.user ? this.form.user.name : this.currentGroup.name
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        if (this.leaveWord.form) {
          this.form = { ...this.leaveWord.form }
          if (this.leaveWord.user) {
            this.form.user = this.leaveWord.user
            this.setCreateObject({ user: null })
          }
        }
      },
      handleObject() {
        if (!this.isOrg) {
          this.setCreateObject({ form: this.form })
          this.routePush({ name: 'selectObject1158' })
        }
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.content)) {
          this.$message({ message: '留言内容不能为空', type: 'warning' })
          return false
        }
        if (form.content.length > 150) {
          this.$message({ message: '留言内容不能超于150字', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1159',
          groupId: that.currentGroup.groupId,
          content: form.content
        })

        let user = form.user
        if (user && user.userId) {
          postData.toUsers = [
            {
              type: 'to',
              userId: user.userId,
              userType: user.userType,
              name: user.name,
              avatar: user.avatar,
              status: '1'
            }
          ]
          postData.notify = [user.userId]
          postData.title = `对{\\@\\${user.name}\\${user.userId}\\}说`
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.setCreateObject({ form: null })
          this.routeBack()
        })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setCreateObject({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
