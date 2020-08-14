<template>
  <Page title="协议账号"
        hasSubmit
        @submit="onSubmit">
    <!-- <div class="category-title"> VXCN</div>
    <Item :hasClick="false"
          label="默认协议">
    </Item> -->
    <div class="agreement-list"
         v-for="(item, i) in visionCameraProtocolAccounts"
         :key="i">
      <div class="category-title">{{item.protocolName}}</div>
      <!-- 默认协议 -->
      <div v-if="i === 0">
        <Item :hasClick="false"
              label="默认协议">
          <div slot="remark">{{item.account}}</div>
        </Item>
      </div>
      <!-- 其它协议 -->
      <div v-if="i !== 0">
        <Item :hasClick="false"
              label="账号">
          <input slot="remark"
                 v-model="item.account"
                 placeholder="输入账号" />
        </Item>
        <Item :hasClick="false"
              label="密码">
          <input slot="remark"
                 v-model="item.password"
                 placeholder="输入密码" />
        </Item>
      </div>

      <!-- <div class="category-title">协议1</div>
      <Item :hasClick="false"
            label="账号">
        <input slot="remark"
              v-model="accont"
              placeholder="输入账号" />
      </Item>
      <Item :hasClick="false"
            label="密码">
        <input slot="remark"
              v-model="pass"
              placeholder="输入密码" />
      </Item> -->
    </div>

  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    data() {
      return {
        devices: [],
        index: 0,
        groupId: '',
        visionCameraProtocolAccounts: []
      }
    },
    created() {
      this.groupId = this.routeQuery('groupId')
      this.getVisionProtocolaccount()
    },
    methods: {
      getVisionProtocolaccount() {
        Api.getVisionProtocolaccount(this.groupId).then(res => {
          if (res.code === '1' && res.visionCameraProtocolAccounts) {
            this.visionCameraProtocolAccounts = res.visionCameraProtocolAccounts
          }
        })
      },
      onSubmit() {
        let visionCameraProtocolAccounts = this.visionCameraProtocolAccounts
        let isHasNull = visionCameraProtocolAccounts.some((item, i) => {
          if (i !== 0) {
            return Check.isNullString(item.account) || Check.isNullString(item.password)
          }
        })
        if (isHasNull) {
          this.$message({ type: 'warning', message: '账号密码不能为空！' })
          return
        }
        // 判断空
        Api.addProtocolaccount({
          visionCameraProtocolAccounts: visionCameraProtocolAccounts
        }).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
