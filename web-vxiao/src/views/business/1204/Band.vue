<template>
  <Page title="绑定"
        hasSubmit
        @submit="onSubmit">
    <Item :hasClick="false">
      <div slot="main">设备编号</div>
      <input slot="remark"
             placeholder="必填"
             v-model="vpad.code" />
    </Item>
    <Item :hasClick="false">
      <div slot="main">硬件序列号</div>
      <input slot="remark"
             placeholder="必填"
             v-model="vpad.serialNumber" />
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        vpad: {
          code: '',
          serialNumber: ''
        }
      }
    },
    methods: {
      onSubmit() {
        Api.saveVpad({
          vpads: [
            {
              schoolId: this.routeQuery('schoolId'),
              ...this.vpad
            }
          ]
        }).then(res => {
          this.$message({ type: 'success', message: '绑定成功' })
          this.routeBack(-1)
        })
      }
    }
  }
</script>
