<template>
  <Page :title="vBox.name"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>序列号</div>
      <input slot="remark"
             v-model="vBox.serialNumber"
             placeholder="序列号" />
    </Item>
    <Item :hasClick="false">
      <div>MAC地址</div>
      <input slot="remark"
             v-model="vBox.macAddress"
             placeholder="MAC地址" />
    </Item>
    <Item :hasClick="false">
      <div>UUID</div>
      <input slot="remark"
             v-model="vBox.uuid"
             placeholder="UUID" />
    </Item>
    <Item @click="setupIp">
      <div>网络设置</div>
      <div slot="remark">{{vBox.isAutoIp==='1'? '自动' : vBox.ipAddress}}</div>
    </Item>
    <Item>
      <div>计入到离线考勤</div>
      <div slot="after">
        <i-switch :value.sync="vBox.isAttendance"
                  trueValue='1'
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <div class="category-title"></div>
    <Item @click="handleCategory">
      <div>类型</div>
      <div slot="remark">{{vBox.categoryName}}</div>
    </Item>
    <Item @click="handlePlace">
      <div>绑定场所</div>
      <div slot="remark">{{vBox.name}}</div>
    </Item>
    <Item v-if="category.value==='2'"
          :hasClick="false"
          label="朝向">
      <el-radio-group slot="remark"
                      v-model="vBox.orientation">
        <el-radio v-for="c in direction"
                  :key="c.id"
                  :label="c.value">{{c.name}}</el-radio>
      </el-radio-group>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  export default {
    data() {
      return {
        vBox: {
          schoolId: '',
          serialNumber: '',
          uuid: '',
          macAddress: '',
          isAutoDns: '1',
          isAutoIp: '1',
          isAttendance: '0',
          netmask: '',
          gateway: '',
          dns1: '',
          dns2: '',
          ipAddress: '',
          placeId: '',
          version: '',
          categoryName: '',
          orientation: '1',
          categoryId: '',
          name: ''
        },
        category: {},
        direction: []
      }
    },
    created() {
      this.$set(this.vBox, 'schoolId', this.routeQuery('schoolId'))
    },
    methods: {
      submit() {
        Api.addvBox({ vBox: this.vBox })
          .then(res => {
            this.$message({ message: '添加成功', type: 'success' })
            this.routeBack()
          })
          .catch(res => {})
      },
      setupIp() {
        this.setStorage('_cache_vBox', this.vBox)
        this.routePush({
          path: '/vx/group/business/1227/setup/ip'
        })
      },
      handleCategory() {
        this.routePush({
          path: '/vx/group/category/select',
          query: {
            title: '场所类型',
            groupId: this.routeQuery('schoolId'),
            type: 187
          }
        })
      },
      handlePlace() {
        if (Check.isNullString(this.category.id)) {
          this.$message({ type: 'warning', message: '请优先选择场所类型' })
          return
        }
        this.setStorage('_cache_categorys', this.category)
        this.routePush({
          path: '/vx/group/place/select',
          query: {
            title: '场所选择',
            schoolId: this.routeQuery('schoolId'),
            type: this.category.value === '2' ? this.category.flag : null
          }
        })
      }
    },
    activated() {
      let _vBox = this.getStorage('_cache_vBox') || {}
      let _place = this.getStorage('_cache_place') || {}
      this.category = this.getStorage('_cache_categorys') || {}
      this.vBox = { ...this.vBox, ..._vBox }
      if (!Check.isNullObject(_place)) {
        this.vBox = {
          ...this.vBox,
          ...{ placeId: _place.id, name: _place.name }
        }
      }
      if (!Check.isNullObject(this.category)) {
        if (this.category.value !== this.vBox.categoryId) {
          this.vBox = {
            ...this.vBox,
            ...{ placeId: '', name: '' }
          }
        }
        this.vBox = {
          ...this.vBox,
          ...{ categoryId: this.category.value, categoryName: this.category.name }
        }
      }
      CategoryApi.getCategorys({ type: 188 }).then(res => {
        this.direction = res.categorys
      })
    }
  }
</script>
