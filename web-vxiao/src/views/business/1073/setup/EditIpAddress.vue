<template>
  <page :title="titleText" hasSubmit @submit="commitEditHandle">
    <item :hasClick="false">
      <div>IP地址</div>
      <input slot="remark" type="text" placeholder="必填" v-model="statusValue">
    </item>
    <item :hasClick="false">
      <div>绑定状态</div>
      <div slot="remark" :class="{'error': routeQuery('value')==='0'}">{{statusText}}</div>
    </item>
    <div class="list-button" v-if="routeQuery('value')">
      <div class="button button-common" @click="unBindIpAddress">解绑</div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        statusValue: ''
      }
    },
    computed: {
      statusText() {
        return this.routeQuery('status') === '0' ? '异常' : this.routeQuery('value') ? '正常' : '未绑定'
      }
    },
    created() {
      this.statusValue = this.routeQuery('value') || ''
    },
    methods: {
      commitEditHandle() {
        if (!this.statusValue) {
          this.$message({
            type: 'warning',
            message: 'IP地址不能为空'
          })
          return false
        }
        this.setHandle(this.statusValue)
      },
      unBindIpAddress() {
        this.setHandle('')
      },
      setHandle(value) {
        Api.setIpAddress({
          data: {
            groupId: this.routeQuery('groupId'),
            value: value
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .error {
    color: red;
  }

</style>
