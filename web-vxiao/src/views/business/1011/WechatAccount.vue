<template>
  <page title="微信账号设置"
        @submit="handleSubmit"
        hasSubmit>
    <div class="wechat-account">
      <item :hasClick="false">
        <div slot="main">公众号APPID</div>
        <input slot="remark"
               placeholder="必填"
               v-model="account.appId" />
      </item>
      <item :hasClick="false">
        <div slot="main"
             class="vx-item-text">公众号密码</div>
        <input slot="remark"
               placeholder="必填"
               v-model="account.password"
               type="password" />
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        account: {
          appId: '',
          password: ''
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        Api.getWechatAccount(that.currentGroup.groupId).then(res => {
          if (res.weiXinInfo) {
            that.account = { appId: res.weiXinInfo.appId, password: res.weiXinInfo.secret }
          }
        })
      },
      handleSubmit() {
        const that = this

        let account = that.account
        if (Check.isNullString(account.appId)) {
          that.$message({ message: '公众号APPID不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(account.password)) {
          that.$message({ message: '公众号密码不能为空', type: 'warning' })
          return false
        }
        Api.commitWechatAccount({
          groupId: that.currentGroup.groupId,
          appId: account.appId,
          secret: account.password
        }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banner-setting {
    .bs-image {
      width: rem(80);
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
      background: #ebebeb;
    }
  }
</style>
