<template>
  <page title="三年一班"
        @back="handleBack"
        listenBack>
    <div>
      <item>
        <div slot="main">序列号</div>
        <div slot="after">FFSFS8EG55</div>
      </item>
      <item>
        <div slot="main">设备名称（自定）</div>
        <div slot="after">
          <input placeholder="选填">
        </div>
      </item>
    </div>
    <!-- <div v-else>
      <item v-if="this.locationData === '1'">
        <div slot="main">序列号</div>
        <div slot="after">
          <input type="text"
                 placeholder="填写序列号">
        </div>
      </item>
      <item>
        <div slot="main">设备名称（自定）</div>
        <div slot="after">
          <input placeholder="选填"
                 v-modeel="devicename">
        </div>
      </item>
    </div> -->
    <div @click="deleteGrage"
         class="button button-common">删除</div>
  </page>
</template>
<script>
  // import Api from './api'
  export default {
    data() {
      return {
        locationData: {},
        devicename: ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        // this.locationData = this.getStorage('_addSort')
        // Api.getAllfacility(this.locationData.id).then((res) => {})
      },
      handleBack() {
        this.routeBack()
      }
    }
  }
</script>
