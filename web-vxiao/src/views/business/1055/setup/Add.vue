<template>
  <Page :title="title"
        @submit="submit"
        hasSubmit>
    <item :hasClick="false">
      <div>选项名称</div>
      <input slot="remark"
             type="text"
             placeholder="必填"
             v-model.trim="optionName">
    </item>
    <div class="list-button"
         v-if="$route.query.type === 'edit'">
      <div class="button button-common"
           @click="deleteInfo">删除</div>
    </div>
  </Page>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        radioList: [],
        title: '',
        optionName: ''
        // type:null, // 添加 或 修改
      }
    },
    created() {
      if (this.$route.query) {
        this.title = this.$route.query.title
        this.optionName = this.$route.query.name
      }
    },
    methods: {
      ...mapActions(['saveRadioDetailList', 'saveCheckboxDetailList', 'deleteRadioDetailItem', 'deleteCheckboxDetailItem']),
      submit() {
        let type = this.$route.query.type
        let index = this.$route.query.index
        let obj = { content: this.optionName, type: type, index: index, title: this.title, selected: false }
        if (this.optionName === '') {
          this.$message.warning('选项名称不能为空')
          return
        }
        if (type === 'add') {
          if (this.title === '单选按钮') {
            this.saveRadioDetailList(obj)
          } else {
            this.saveCheckboxDetailList(obj)
          }
        } else {
          if (this.title === '单选按钮') {
            this.saveRadioDetailList(obj)
          } else {
            this.saveCheckboxDetailList(obj)
          }
        }
        this.$router.go(-1)
      },
      deleteInfo() {
        let index = this.$route.query.index
        if (this.title === '单选按钮') {
          this.deleteRadioDetailItem(index)
        } else {
          this.deleteCheckboxDetailItem(index)
        }
        this.$router.go(-1)
      }
    }
  }
</script>
