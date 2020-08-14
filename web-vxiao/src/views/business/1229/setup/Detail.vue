<template>
  <Page title="详情">
    <Item :hasClick="false">
      <div>绑定场所</div>
      <div slot="remark">{{vvr.name}}</div>
    </Item>
    <Item :hasClick="false">
      <div>序列号</div>
      <div slot="remark">{{vvr.serialNumber}}</div>
    </Item>
    <Item :hasClick="false">
      <div>状态</div>
      <div slot="remark">
        <template v-if="vvr.status===1">正常</template>
        <template v-else><span class="text-color error">异常</span></template>
      </div>
    </Item>
    <Item :hasClick="false">
      <div>版本</div>
      <div slot="remark">{{vvr.version}}</div>
    </Item>
    <div class="list-button">
      <el-button type="danger" icon="el-icon-delete" size="medium" @click="unband">解绑</el-button>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() { return { vvr: {} } },
    methods: {
      unband() {
        const that = this
        that.$confirm(` `, '是否确认解绑?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.addVVR({
            id: that.vvr.id,
            schoolId: that.vvr.schoolId,
            status: 'd'
          }).then(res => {
            that.$message({ type: 'success', message: '解绑成功' })
            that.routeBack()
          })
        })
      }
    },
    created() {
      this.vvr = this.getStorage('_cache_vvr') || {}
    }
  }

</script>
