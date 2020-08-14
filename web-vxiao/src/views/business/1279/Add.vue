<template>
  <Page :title="title"
        hasSubmit
        @submit="onSubmit">
    <Item label="场所"
          @click="onPlace">
      <div slot="remark">{{visionPlace.name || '必选'}}</div>
    </Item>
    <Item v-for="(v,i) in visionPlace.devices"
          :key="i"
          @click="onDevice(i)">
      <div slot="before"
           v-if="i>1">
        <i class="ico ico-delete"
           @click.stop="onDeleteDevice(i)" />
      </div>
      <div>{{v.name}}{{v.sort}}</div>
      <div slot="remark">{{v.serialNumber === '' ? '必选' : v.serialNumber}}</div>
    </Item>
    <Item @click="onAddDevice"
          label="添加摄像头">
      <div slot="before">
        <i class="ico ico-plus" />
      </div>
      <span slot="after"></span>
    </Item>
    <div class="category-title"></div>
    <el-dropdown trigger="click"
                 class="block-element"
                 @command="onQuality">
      <Item label="视频质量">
        <div slot="remark">{{qualityText}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="0">自适应</el-dropdown-item>
        <el-dropdown-item command="1">480P</el-dropdown-item>
        <el-dropdown-item command="2">720P</el-dropdown-item>
        <el-dropdown-item command="3">1080P</el-dropdown-item>
        <el-dropdown-item command="4">4K</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 直播服务器 -->
    <el-dropdown trigger="click"
                 class="block-element"
                 @command="handleServerCategorys227">
      <Item label="直播服务器IP"
            @click="handleNull('227')">
        <div slot="remark">{{streamingServerAddress}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,i) in serverCategorys227"
                          :key="i"
                          :command="item.value">{{item.name}}</el-dropdown-item>
        <!-- <el-dropdown-item command="4">名称192.168.3.115</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 录播服务器 -->
    <el-dropdown trigger="click"
                 class="block-element"
                 @command="handleServerCategorys228">
      <Item label="录播服务器IP"
            @click="handleNull('228')">
        <div slot="remark">{{recordingServerAddress}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item,i) in serverCategorys228"
                          :key="i"
                          :command="item.value">{{item.name}}</el-dropdown-item>
        <!-- <el-dropdown-item command="4">名称192.168.3.115</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <Item :hasClick="false"
          label="推流地址">
      <input slot="remark"
             v-model="visionPlace.streamingServerAddress"
             placeholder="输入IP地址" />
    </Item> -->
    <Item :hasClick="false"
          label="大屏地址">
      <input slot="remark"
             v-model="visionPlace.screenAddress"
             placeholder="输入IP地址" />
    </Item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  import CategoryApi from '@/api/category'
  export default {
    mixins: [R],
    data() {
      return {
        visionPlace: {
          devices: [{ name: '摄像头', serialNumber: '', localAddress: '', type: '1', sort: 1 }, { name: '摄像头', serialNumber: '', localAddress: '', type: '1', sort: 2 }]
        },
        title: '',
        vs: [],
        streamingServerAddress: '',
        serverCategorys227: [],
        recordingServerAddress: '',
        serverCategorys228: []
      }
    },
    computed: {
      qualityText() {
        switch (this.visionPlace.quality) {
          case '1':
            return '480P'
          case '2':
            return '720P'
          case '3':
            return '1080P'
          case '4':
            return '4K'
          default:
            return '自适应'
        }
      }
    },
    activated() {
      this.title = '新增设备'
      let cacheDevices = this.getStorage('_cache_devices', true)
      if (!Check.isNullObject(cacheDevices)) {
        this.$set(this.visionPlace, 'devices', cacheDevices)
      }
      let cachePlace = this.getStorage('_cache_place', true)
      if (!Check.isNullObject(cachePlace)) {
        this.$set(this.visionPlace, 'name', cachePlace.name)
        this.$set(this.visionPlace, 'placeId', cachePlace.id)
      }
      this.getServerCategorys('227')
      this.getServerCategorys('228')
    },
    methods: {
      getServerCategorys(type) {
        CategoryApi.getCategorys({
          groupId: this.groupId,
          type: type
        }).then(res => {
          if (res.code === '1' && res.categorys) {
            if (type === '227') {
              this.serverCategorys227 = res.categorys
            }
            if (type === '228') {
              this.serverCategorys228 = res.categorys
            }
          }
        })
      },
      handleServerCategorys227(command) {
        this.streamingServerAddress = command
      },
      handleServerCategorys228(command) {
        this.recordingServerAddress = command
      },
      handleNull(type) {
        if (type === '227' && this.serverCategorys227.length === 0) {
          this.$message({ type: 'warning', message: '暂无服务器IP可选,请在应用设置中添加IP' })
        }
        if (type === '228' && this.serverCategorys228.length === 0) {
          this.$message({ type: 'warning', message: '暂无服务器IP可选,请在应用设置中添加IP' })
        }
      },
      onSubmit() {
        if (Check.isNull(this.visionPlace.placeId)) {
          this.$message({ type: 'warning', message: '请选择场所' })
          return
        }
        let _devices = this.visionPlace.devices.filter(d => {
          return !Check.isNullString(d.serialNumber) && !Check.isNullString(d.protocolId)
        })
        if (!Check.isRealArray(_devices)) {
          this.$message({ type: 'warning', message: '摄像头为空' })
          return
        }
        Api.addVisionPlace({
          visionPlaces: [
            {
              streamingServerAddress: this.streamingServerAddress,
              recordingServerAddress: this.recordingServerAddress,
              ...this.visionPlace,
              ...{ schoolId: this.schoolId, devices: _devices }
            }
          ]
        }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      },
      onAddDevice() {
        this.visionPlace.devices.push({
          name: `摄像头`,
          serialNumber: '',
          localAddress: '',
          type: '1',
          sort: this.visionPlace.devices.length
        })
        this.onDevice(this.visionPlace.devices.length - 1)
      },
      onDeleteDevice(i) {
        this.visionPlace.devices.splice(i, 1)
      },
      onPlace() {
        this.routePush({
          path: '/vx/group/business/1279/places',
          query: { schoolId: this.schoolId }
        })
      },
      onDevice(i) {
        this.setStorage('_cache_devices', { index: i, devices: this.visionPlace.devices })
        this.routePush({
          path: '/vx/group/business/1279/device',
          query: { groupId: this.groupId }
        })
      },
      onQuality(command) {
        this.$set(this.visionPlace, 'quality', command)
      }
    },
    watch: {
      'visionPlace.devices'(d) {
        d.some((_d, i) => {
          this.$set(this.visionPlace.devices[i], 'sort', i + 1)
        })
      }
    }
  }
</script>
