<template>
  <Page title="财务信息">
    <div v-for="(item,index) in msg"
         :key="index">
      <div class="category-title">{{item.name}}</div>
      <item @click="msgClick(item,index)">
        <div slot="main">{{item.date}}</div>
        <div slot="remark">{{Status(item.status)}}</div>
      </item>
    </div>

  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Cammand from '@/constant/cammand.js'
  export default {
    mixins: [R],
    data() {
      return {
        msg: []
      }
    },
    // created() {
    //   this.getTemplate()
    // },
    activated() {
      this.getTemplate()
      this.$web.postJsAction({
        type: Cammand.ACTION_TITLE,
        content: '财务信息'
      })
    },
    computed: {
      isWeb() {
        if (this.routeQuery('tokenId')) {
          return false
        }
        return true
      }
    },
    methods: {
      Status(status) {
        if (status === '1') {
          return '已填写'
        } else if (status === '2') {
          return '未填写'
        } else if (status === '3') {
          return '已截止'
        } else {
          return '未开始'
        }
      },
      getTemplate() {
        const schoolId = this.routeQuery('schoolId') ? this.routeQuery('schoolId') : this.schoolId
        Api.queryStatus(schoolId).then(res => {
          if (res.code === '1') {
            this.msg = res.templates
          }
        })
      },
      msgClick(item, index) {
        let schoolId = this.routeQuery('schoolId') ? this.routeQuery('schoolId') : ''
        let isEducation = this.routeQuery('isEducation')
        if (this.isWeb) {
          isEducation = this.isEducation
        } else {
          if (isEducation && isEducation === 'false') {
            isEducation = false
          } else {
            isEducation = true
          }
        }
        if (isEducation) {
          this.routePush({
            name: 'groupEntry10039',
            query: { status: item.status, templateId: item.id, name: item.name, schoolId: schoolId }
          })
        } else {
          this.routePush({
            name: 'table10039',
            query: { status: item.status, templateId: item.id, name: item.name, schoolId: schoolId }
          })
        }
      }
    },
    watch: {}
  }
</script>
