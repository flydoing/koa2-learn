<!-- 门禁 -->
<template>
  <Page title="门禁详情">
    <item>
      <div slot="main">设备类型</div>
      <div slot="after">{{viot.categoryName}}</div>
    </item>
    <item>
      <div slot="main">设备名称</div>
      <div slot="after">{{viot.name}}</div>
    </item>
    <item>
      <div slot="main">硬件IP地址</div>
      <div slot="after">{{viot.ipAddress}}</div>
    </item>
    <item>
      <div slot="main">门号</div>
      <div slot="after">{{viot.extension}}</div>
    </item>
    <template v-if="viot.viotCardRelations ">
      <div class="category-title ">门禁卡</div>
      <item v-for="(door,i) in viot.viotCardRelations" :key="i">
        <div slot="main">门禁管理卡</div>
        <div slot="after">{{door.cardId}}</div>
      </item>
    </template>
    <div class="list-button">
      <div class="button big error" @click="handleBinding">解除绑定</div>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        viot: this.$route.query
      }
    },
    methods: {
      handleBinding() {
        const that = this
        this.$confirm('确定移除绑定？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              Api.addViot({
                viot: {
                  id: that.viot.id,
                  placeId: that.viot.placeId,
                  status: 'd'
                }
              }).then(res => {
                done()
                instance.confirmButtonLoading = false
                that.$message({ message: '移除成功', type: 'success' })
                that.routeBack()
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      }
    }
  }

</script>
