<template>
  <Page title="联考详情">
    <label slot="btn"
           v-if="canImport"
           @click="handleImport">导入</label>
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.groupName"
          :remark="item.value"
          :hasClick="item.clickAble"
          @click="handleItem(item)">
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        message: null
      }
    },
    computed: {
      canImport() {
        let m = this.message || {}
        return m.remark === '1'
      }
    },
    created() {
      this.fetchData()
      MessageApi.getMessageById(this.routeQuery('msgId')).then(res => {
        this.message = res.message
      })
    },
    methods: {
      fetchData(msgId) {
        Api.getClasses(this.routeQuery('msgId')).then(res => {
          this.list = res.separateClass || []
        })
      },
      handleItem(item) {
        this.routePush({
          name: 'report1123',
          params: {
            groupId: item.groupId
          },
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      },
      handleImport() {
        this.$import({
          title: '导入成绩表',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/examTemplate.xlsx',
          callback: (res, file) => {
            Api.parseExcel({
              ...this.constructionMessage(),
              groupId: this.groupId,
              fileId: res.file.id,
              entranceExam: JSON.parse(this.message.msgJson)
            }).then(res => {
              if (res.commonTables) {
                this.setStorage('exam_import_data', res.commonTables)
                this.routePush({ name: 'errorView1123' })
              } else {
                this.fetchData()
                this.$message({ type: 'success', message: '操作成功' })
              }
            })
          }
        })
      }
    }
  }
</script>
