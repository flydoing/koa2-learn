<template>
  <page title="添加"
        @back="handleBack"
        listenBack
        @submit="handleNext"
        hasSubmit>
    <div v-if="locationData.status === '0'">
      <item>
        <div slot="main">序列号</div>
        <input slot="after"
               placeholder="选填"
               v-model="locationData.viotsList.serialNumber">
      </item>
      <item>
        <div slot="main">设备名称（自定）</div>
        <div slot="after">
          <input placeholder="选填"
                 v-model="locationData.viotsList.name">
        </div>
      </item>
    </div>
    <div v-else>
      <item>
        <div slot="main">序列号</div>
        <div slot="after">
          <input type="text"
                 placeholder="填写序列号"
                 v-model="serialNumber">
        </div>
      </item>
      <item>
        <div slot="main">设备名称（自定）</div>
        <div slot="after">
          <input placeholder="选填"
                 v-model="designation">
        </div>
      </item>
    </div>
    <div class="list-button">
      <el-button @click="deleteGrage"
                 v-if="this.locationData.status === '0'"
                 type="danger"
                 icon="el-icon-delete"
                 size="medium">解绑</el-button>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        locationData: {},
        serialNumber: '',
        designation: '',
        placeIdData: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.placeIdData = this.getStorage('_deviceInfo')
        this.locationData = this.getStorage('_addSort')
      },
      handleBack() {
        this.setStorage('_deviceInfo', this.placeIdData)
        this.routeBack()
      },
      deleteGrage() {
        let voots = this.locationData.viotsList
        let viot = {
          viot: {
            status: 'd',
            id: this.locationData.viotsList.id,
            placeId: this.placeIdData.id,
            schoolId: this.currentGroup.parentId,
            categoryType: voots.extension,
            categoryId: voots.id
          }
        }
        Api.addViot(viot).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.setStorage('_deviceInfo', this.placeIdData)
          this.routeBack()
        })
      },
      handleNext() {
        // 1是增加
        let voots = this.locationData.viotsList
        if (this.locationData.status === '1') {
          if (Check.isNullString(this.serialNumber) || Check.isNullString(this.designation)) {
            this.$message({ type: 'warning', message: '不能为空' })
          } else {
            let viot = {
              viot: {
                name: this.designation,
                placeId: this.placeIdData.id,
                schoolId: this.currentGroup.parentId,
                serialNumber: this.serialNumber,
                categoryType: voots.extension,
                categoryId: voots.id
              }
            }
            Api.addViot(viot).then(res => {})
            this.setStorage('_deviceInfo', this.placeIdData)
            this.routeBack()
          }
        } else {
          let serialNumber = this.locationData.viotsList.serialNumber
          let serialName = this.locationData.viotsList.name
          if (Check.isNullString(serialNumber) || Check.isNullString(serialName)) {
            this.$message({ type: 'warning', message: '不能为空' })
          } else {
            let viot = {
              viot: {
                name: serialName,
                placeId: this.placeIdData.id,
                schoolId: this.currentGroup.parentId,
                serialNumber: serialNumber,
                categoryType: voots.extension,
                categoryId: voots.id
              }
            }
            Api.addViot(viot).then(res => {})
            this.setStorage('_deviceInfo', this.placeIdData)
            this.routeBack()
          }
        }
      }
    }
  }
</script>
