<template>
  <Page title="网络设置" hasSubmit @submit="confirm">
    <Item>
      <div>自动获取IP地址</div>
      <div slot="after">
        <i-switch :value.sync="vBox.isAutoIp" trueValue='1' falseValue="0"></i-switch>
      </div>
    </Item>
    <Item :hasClick="false">
      <div>IP地址</div>
      <input slot="remark" placeholder="IP地址" v-model="vBox.ipAddress" />
    </Item>
    <Item :hasClick="false">
      <div>子网掩码</div>
      <input slot="remark" placeholder="子网掩码" v-model="vBox.netmask" />
    </Item>
    <Item :hasClick="false">
      <div>默认网关</div>
      <input slot="remark" placeholder="默认网关" v-model="vBox.gateway" />
    </Item>
    <div class="category-title"></div>
    <Item>
      <div>自动获取IP地址</div>
      <div slot="after">
        <i-switch :value.sync="vBox.isAutoDns" trueValue='1' falseValue="0"></i-switch>
      </div>
    </Item>
    <Item :hasClick="false">
      <div>自动获取DNS服务器地址</div>
      <input slot="remark" placeholder="DNS服务器地址" v-model="vBox.dns1" />
    </Item>
    <Item :hasClick="false">
      <div>备用DNS服务器</div>
      <input slot="remark" placeholder="备用DNS服务器" v-model="vBox.dns2" />
    </Item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        vBox: {
          isAutoDns: '0',
          isAutoIp: '0',
          netmask: '',
          gateway: '',
          dns1: '',
          dns2: '',
          ipAddress: ''
        }
      }
    },
    created() {
      this.vBox = this.getStorage('_cache_vBox')
    },
    methods: {
      confirm() {
        if (Check.isNullString(this.vBox.ipAddress)) {
          this.$message({ type: 'warning', message: 'IP地址不能为空' })
        }
        this.setStorage('_cache_vBox', this.vBox)
        this.routeBack()
      }
    }
  }

</script>
