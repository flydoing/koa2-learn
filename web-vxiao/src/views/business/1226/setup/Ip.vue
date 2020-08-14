<template>
  <Page title="网络设置"
        hasSubmit
        @submit="confirm">
    <Item>
      <div>自动获取IP地址</div>
      <div slot="after">
        <i-switch :value.sync="vPos.isAutoIp"
                  trueValue='1'
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <Item :hasClick="false">
      <div>IP地址</div>
      <input slot="remark"
             placeholder="IP地址"
             v-model="vPos.ipAddress" />
    </Item>
    <Item :hasClick="false">
      <div>子网掩码</div>
      <input slot="remark"
             placeholder="子网掩码"
             v-model="vPos.netmask" />
    </Item>
    <Item :hasClick="false">
      <div>默认网关</div>
      <input slot="remark"
             placeholder="默认网关"
             v-model="vPos.gateway" />
    </Item>
    <div class="category-title"></div>
    <Item>
      <div>自动获取IP地址</div>
      <div slot="after">
        <i-switch :value.sync="vPos.isAutoDns"
                  trueValue='1'
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <Item :hasClick="false">
      <div>自动获取DNS服务器地址</div>
      <input slot="remark"
             placeholder="DNS服务器地址"
             v-model="vPos.dns1" />
    </Item>
    <Item :hasClick="false">
      <div>备用DNS服务器</div>
      <input slot="remark"
             placeholder="备用DNS服务器"
             v-model="vPos.dns2" />
    </Item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        vPos: {
          isAutoDns: '',
          isAutoIp: '',
          netmask: '',
          gateway: '',
          dns1: '',
          dns2: '',
          ipAddress: ''
        }
      }
    },
    created() {
      if (this.vPos) {
        this.vPos = this.getStorage('_cache_vPos')
      }
    },
    methods: {
      confirm() {
        if (Check.isNullString(this.vPos.ipAddress) && (Check.isNullString(this.vPos.isAutoIp) || this.vPos.isAutoIp === '0')) {
          this.$message({ type: 'warning', message: 'IP地址不能为空' })
          return
        }
        this.setStorage('_cache_vPos', this.vPos)
        this.routeBack()
      }
    }
  }
</script>
