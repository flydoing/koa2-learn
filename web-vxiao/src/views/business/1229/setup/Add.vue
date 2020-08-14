<template>
  <Page title="新增VVR"
        @submit="submit"
        @hasSubmit="true">
    <Item @click="place">
      <div>绑定场所</div>
      <div slot="remark">{{vvr.name}}</div>
    </Item>
    <Item class="full-input"
          :hasClick="false">
      <input placeholder="序列号"
             v-model="vvr.serialNumber" />
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        vvr: {
          schoolId: this.routeQuery('schoolId'),
          serialNumber: '',
          name: '',
          placeId: ''
        }
      }
    },
    methods: {
      submit() {
        Api.addVVR(this.vvr).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      },
      place() {
        this.routePush({
          path: '/vx/group/place/select',
          query: {
            schoolId: this.routeQuery('schoolId')
          }
        })
      }
    },
    activated() {
      let cachePlace = this.getStorage('_cache_place')
      if (cachePlace) {
        this.$set(this.vvr, 'name', cachePlace.name)
        this.$set(this.vvr, 'placeId', cachePlace.id)
      }
    }
  }
</script>
