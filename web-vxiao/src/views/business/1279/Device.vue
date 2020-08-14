<template>
  <Page title="摄像头"
        hasSubmit
        @submit="onSubmit">
    <!-- <Item label="IP地址"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="devices[index].localAddress" />
    </Item> -->
    <el-dropdown trigger="click"
                 class="block-element"
                 @command="handleProtoco">
      <Item label="协议">
        <div slot="remark">{{protocolName}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, i) in visionCameraProtocolAccounts"
                          :key="i"
                          :command="item">{{item.protocolName}}</el-dropdown-item>
        <!-- <el-dropdown-item command="4">名称192.168.3.115</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <Item label="通道"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="devices[index].channel" />
    </Item>
    <Item label="IP地址"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="devices[index].localAddress" />
    </Item>
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
        visionCameraProtocolAccounts: [],
        protocolName: ''
      }
    },
    created() {
      let { index, devices } = this.getStorage('_cache_devices')
      this.devices = devices
      this.index = index
      this.protocolName = this.devices[this.index].protocolName
      this.groupId = this.routeQuery('groupId')
      this.getVisionProtocolaccount()
    },
    methods: {
      handleProtoco(command) {
        this.devices[this.index].protocolId = command.id
        this.protocolName = command.protocolName
        this.devices[this.index].protocolName = command.protocolName
      },
      getVisionProtocolaccount() {
        Api.getVisionProtocolaccount(this.groupId).then(res => {
          if (res.code === '1' && res.visionCameraProtocolAccounts) {
            this.visionCameraProtocolAccounts = res.visionCameraProtocolAccounts
          }
        })
      },
      onSubmit() {
        let device = this.devices[this.index]
        if (Check.isNullString(device.protocolId)) {
          this.$message({ type: 'warning', message: '协议不能为空' })
          return
        }
        if (Check.isNullString(device.channel)) {
          this.$message({ type: 'warning', message: '通道不能为空' })
          return
        }
        if (Check.isNullString(device.localAddress)) {
          this.$message({ type: 'warning', message: 'IP地址不能为空' })
          return
        }
        this.setStorage('_cache_devices', this.devices)
        this.routeBack()
      }
    }
  }
</script>
