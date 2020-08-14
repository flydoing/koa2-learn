<template>
  <page title="新建校长信箱"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="principal-mail-create">
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <TextInput placeholder="内容"
                 v-model="form.content"></TextInput>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          title: '',
          content: ''
        }
      }
    },
    created() {},
    computed: {},
    methods: {
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1177',
          groupId: that.currentGroup.groupId,
          content: form.content,
          title: form.title
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
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
  .principal-mail-create {
    textarea {
      height: rem(100);
      border-bottom: rem(1) solid #ededed;
    }
  }
</style>
