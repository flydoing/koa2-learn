<template>
  <Page :title="vBox.name"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>序列号</div>
      <input slot="remark"
             v-model='vBox.serialNumber'
             placeholder="序列号" />
    </Item>
    <Item>
      <div>IP地址</div>
      <div slot="remark">{{vBox.ipAddress}}</div>
    </Item>
    <Item :hasClick="false">
      <div>UUID</div>
      <input slot="remark"
             v-model="vBox.uuid"
             placeholder="UUID" />
    </Item>
    <Item :hasClick="false">
      <div>MAC地址</div>
      <input slot="remark"
             v-model="vBox.macAddress"
             placeholder="MAC地址" />
    </Item>
    <Item :hasClick="false">
      <div>版本号</div>
      <div slot="remark">{{vBox.version}}</div>
    </Item>
    <Item :hasClick="false">
      <div>蓝牙</div>
      <div slot="remark"
           :class="{'error':vBox.bluetooth==='1'}">
        {{vBox.bluetooth==='1'?'正常':'异常'}}
      </div>
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
          :hasClick="false">
      <div v-for="c in direction"
           :key="c.id"
           @click="$set(vBox,'orientation',c.value)">
        <i class="ico ico-select"
           :class="{'active':vBox.orientation===c.value}" /><span>{{c.name}}</span>
      </div>
    </Item>
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
  import CategoryApi from '@/api/category'
  export default {
    data() {
      return {
        vBox: {},
        category: {},
        direction: []
      }
    },
    created() {
      this.$set(this.vBox, 'schoolId', this.routeQuery('schoolId'))
    },
    methods: {
      submit() {
        Api.modifyvBox({ vBox: this.vBox })
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
            Api.unbindvBox({
              vBox: { id: this.vBox.id }
            }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
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
      Api.getvBoxById(this.routeQuery('id'))
        .then(res => {
          this.vBox = res.vBox
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
            this.vBox = {
              ...this.vBox,
              ...{ categoryId: this.category.value, categoryName: this.category.name }
            }
          }
        })
        .catch(res => {})
      CategoryApi.getCategorys({ type: 188 }).then(res => {
        this.direction = res.categorys
      })
    }
  }
</script>
