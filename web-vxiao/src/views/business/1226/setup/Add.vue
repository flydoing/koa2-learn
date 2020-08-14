<template>
  <Page title="新增"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>序列号</div>
      <input slot="remark"
             v-model="vPos.code"
             placeholder="序列号" />
    </Item>
    <Item @click="setupIp">
      <div>网络设置</div>
      <div slot="remark">{{vPos.isAutoIp==='1'? '自动' : vPos.ipAddress}}</div>
    </Item>
    <Item @click="$set(vPos,'attendanceTakePhoto',vPos.attendanceTakePhoto==='1'?'0':'1')"
          :hasArrow="false">
      <div>是否开启考勤抓拍</div>
      <div slot="remark">
        <i-switch :value.sync="vPos.attendanceTakePhoto"
                  trueValue="1"
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <Item @click="$set(vPos,'isFaceDetect',vPos.isFaceDetect==='1'?'0':'1')"
          :hasArrow="false">
      <div>是否开启人脸识别</div>
      <div slot="remark">
        <i-switch :value.sync="vPos.isFaceDetect"
                  trueValue="1"
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <div class="category-title"></div>
    <Item @click="onCategory">
      <div>绑定场所</div>
      <div slot="remark">{{vPos.categoryName}}</div>
      <div slot="remark">{{vPos.name}}</div>
    </Item>
    <!-- <Item @click="onCategory">
      <div>类型</div>
      <div slot="remark">{{vPos.categoryName}}</div>
    </Item> -->
    <!-- <Item @click="onPlace">
      <div>绑定场所</div>
      <div slot="remark">{{vPos.name}}</div>
    </Item> -->

    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleMode">
      <div class="el-dropdown-link">
        <Item>
          <div>模式</div>
          <div slot="remark">{{vPos.modelName}}</div>
        </Item>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="item"
                          v-for="(item,index) in mode"
                          :key="index">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title text"
         v-if="vPos.modelName === '取餐消费' || vPos.modelName === '门禁'"></div>
    <Item @click="$set(vPos,'isTakeMealModel',vPos.isTakeMealModel==='1'?'0':'1')"
          :hasArrow="false"
          v-show="vPos.modelName === '取餐消费'">
      <div>是否开启取餐模式</div>
      <div slot="remark">
        <i-switch :value.sync="vPos.isTakeMealModel"
                  trueValue="1"
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="doorPermission">
      <div class="el-dropdown-link">
        <Item v-show="vPos.modelName === '门禁'">
          <div>开门权限</div>
          <div slot="remark">{{vPos.openDoorUserName}}</div>
        </Item>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="item"
                          v-for="(item,index) in doorUserList"
                          :key="index">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        vPos: {
          code: '',
          isAutoDns: 0,
          isAutoIp: '',
          netmask: '',
          gateway: '',
          dns1: '',
          dns2: '',
          ipAddress: '',
          placeId: '',
          version: '',
          categoryName: '',
          categoryId: '',
          name: '',
          modelName: '', // 取餐模式
          modelType: '', //
          openDoorUserName: '场所管理员', // 开门权限 默认为场所管理员
          openDoorUser: '1',
          isFaceDetect: '0',
          isTakeMealModel: '0',
          attendanceTakePhoto: '0'
        },
        place: {}, // 场所
        category: {}, // 场所类型
        mode: [], // 模式
        doorUserList: [] // 开门人员列表
      }
    },
    created() {
      this.$set(this.vPos, 'schoolId', this.routeQuery('schoolId'))
      this.getvPosMode()
      this.getvPosDoorUsers()
    },
    methods: {
      // 获取模式列表
      getvPosMode() {
        Api.getvPosMode().then(res => {
          this.mode = res.categorys
        })
      },
      // 获取开门权限人员
      getvPosDoorUsers() {
        Api.getvPosDoorUsers().then(res => {
          this.doorUserList = res.categorys
        })
      },
      submit() {
        if (!this.vPos.categoryId) {
          this.$message({ type: 'warning', message: '请选择类型' })
          return
        }
        if (!this.vPos.placeId) {
          this.$message({ type: 'warning', message: '请选择场所' })
          return
        }
        Api.addvPos({ vPos: this.vPos })
          .then(res => {
            this.$message({ message: '添加成功', type: 'success' })
            this.routeBack()
          })
          .catch(res => {})
      },
      setupIp() {
        this.setStorage('_cache_vPos', this.vPos)
        this.routePush({
          path: '/vx/group/business/1226/setup/ip'
        })
      },
      onCategory() {
        this.setStorage('_cache_categorys', this.category)
        this.setStorage('_cache_place', this.place)
        this.routePush({
          path: '/vx/group/category/select',
          query: {
            title: '场所类型',
            groupId: this.routeQuery('schoolId'),
            depth: 1,
            type: 153
          }
        })
      },
      // 选择取餐模式
      handleMode(item) {
        this.vPos.modelName = item.name
        this.vPos.modelType = item.value
      },
      // 选择开门权限
      doorPermission(item) {
        this.vPos.openDoorUserName = item.name
        this.vPos.openDoorUser = item.value
      }
    },
    activated() {
      let _vPos = this.getStorage('_cache_vPos') || {}
      this.place = this.getStorage('_cache_place') || {}
      this.category = this.getStorage('_cache_categorys') || {}
      this.vPos = { ...this.vPos, ..._vPos }
      if (!Check.isNullObject(this.category)) {
        this.vPos = {
          ...this.vPos,
          ...{
            categoryId: this.category.id,
            categoryName: this.category.name,
            placeId: void 0,
            name: ''
          }
        }
      }
      if (!Check.isNullObject(this.place)) {
        this.vPos = {
          ...this.vPos,
          ...{
            placeId: this.place.id,
            name: this.place.name
          }
        }
      }
    }
  }
</script>
