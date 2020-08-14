<template>
  <div class="visitor-detail">
    <item :hasClick="false">
      <div slot="main">被访人</div>
      <div slot="remark"
           v-html="form.userName"></div>
    </item>
    <item :hasClick="false">
      <div slot="main">来访人</div>
      <input slot="remark"
             type="text"
             placeholder="必填"
             v-model="form.visitorName" />
    </item>
    <item class="vi-time"
          :hasClick="false">
      <div slot="main">预约时间</div>
      <div slot="remark"
           v-html="form.appointDate"></div>
    </item>
    <item :hasClick="false">
      <div slot="main">事由</div>
      <div slot="remark"
           v-html="form.categoryName"></div>
    </item>
    <item :hasClick="false">
      <div slot="main">身份证</div>
      <input slot="remark"
             type="text"
             placeholder="选填"
             v-model="form.visitorIdCard" />
    </item>
    <item :hasClick="false">
      <div slot="main">手机号</div>
      <input slot="remark"
             type="text"
             placeholder="必填"
             v-model="form.mobile" />
    </item>
    <div class="button button-common"
         @click="handleSubmit">确定</div>
  </div>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    data() {
      return {
        form: {
          visitorName: '',
          userName: '',
          appointDate: '',
          categoryName: '',
          visitorIdCard: '',
          mobile: ''
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        let msgId = this.routeQuery('msgId')
        let tokenId = this.routeQuery('tokenId')
        let clientId = this.routeQuery('clientId')
        if (tokenId) {
          this.$http.defaults.headers.common['clientId'] = clientId
          this.$http.defaults.headers.common['tokenId'] = tokenId
        }

        Api.getVisitorInfo(msgId).then(res => {
          if (res.visitor) {
            this.form = res.visitor
          }
        })
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.form.visitorName)) {
          that.$message({ message: '来访人不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullObject(that.form.mobile)) {
          that.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }

        Api.modifyVisitorInfo(that.form).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
