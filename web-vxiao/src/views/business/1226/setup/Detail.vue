<template>
  <Page :title="vPos.name"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>序列号</div>
      <input slot="remark"
             v-model='vPos.code'
             placeholder="序列号" />
    </Item>
    <Item>
      <div>IP地址</div>
      <div slot="remark">{{vPos.ipAddress}}</div>
    </Item>
    <Item :hasClick="false">
      <div>UUID</div>
      <input slot="remark"
             v-model="vPos.uuid"
             placeholder="UUID" />
    </Item>
    <Item :hasClick="false">
      <div>MAC地址</div>
      <input slot="remark"
             v-model="vPos.macAddress"
             placeholder="MAC地址" />
    </Item>
    <Item :hasClick="false">
      <div>版本号</div>
      <div slot="remark">{{vPos.version}}</div>
    </Item>
    <Item :hasClick="false">
      <div>蓝牙</div>
      <div slot="remark"
           :class="{'error':vPos.bluetooth==='1'}">
        {{vPos.bluetooth==='1'?'正常':'异常'}}
      </div>
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
    <Item @click="handleCategory">
      <div>绑定场所</div>
      <div slot="remark">{{vPos.categoryName}}</div>
      <div slot="remark">{{vPos.name}}</div>
    </Item>
    <!-- <Item @click="handleCategory">
      <div>类型</div>
      <div slot="remark">{{vPos.categoryName}}</div>
    </Item>
    <Item @click="handlePlace">
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
    <div class="category-title text"></div>
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
    <div class="list-button">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="remove">解绑</el-button>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        vPos: {},
        place: {},
        category: {},
        categorys: [],
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
        if (Check.isNull(this.vPos.categoryId)) {
          this.$message({ type: 'warning', message: '请选择类型' })
          return
        }
        if (Check.isNull(this.vPos.placeId)) {
          this.$message({ type: 'warning', message: '请选择场所类型' })
          return
        }
        Api.modifyvPos({ vPos: this.vPos })
          .then(res => {
            this.$message({ message: '修改成功', type: 'success' })
            this.routeBack()
          })
          .catch(res => {})
      },
      remove() {
        const that = this
        that
          .$confirm('确定解绑?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.unbindvPos({
              vPos: { id: this.vPos.id }
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      setupIp() {
        this.setStorage('_cache_vPos', this.vPos)
        this.routePush({
          path: '/vx/group/business/1226/setup/ip'
        })
      },
      handleCategory() {
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
      // 取餐模式选择
      handleMode(item) {
        this.vPos.modelName = item.name
        this.vPos.modelType = item.value
      },
      // 选择开门权限
      doorPermission(item) {
        this.vPos.openDoorUserName = item.name
        this.vPos.openDoorUser = item.value
      },
      get() {
        Api.getvPosById(this.routeQuery('id'))
          .then(res => {
            this.vPos = {
              ...res.vPos,
              ...this.vPos
            }
          })
          .catch(res => {})
      }
    },
    activated() {
      if (this.vPos.id) {
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
      } else {
        this.get()
      }
    }
  }
</script>
