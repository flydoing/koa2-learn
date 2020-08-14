<template>
  <Page title="编辑"
        hasSubmit
        @submit="onSubmit">
    <Item label="名称"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="vRoadGate.name" />
    </Item>
    <Item label="人脸识别"
          :hasArrow="false"
          @click="$set(vRoadGate,'isFaceDetect',vRoadGate.isFaceDetect === '0'?'1':'0')">
      <div slot="remark">
        <i-switch :value.sync="vRoadGate.isFaceDetect"
                  trueValue="1"
                  falseValue="0" />
      </div>
    </Item>
    <Item label="考勤抓拍"
          :hasArrow="false"
          @click="$set(vRoadGate,'attendanceTakePhoto',vRoadGate.attendanceTakePhoto === '0'?'1':'0')">
      <div slot="remark">
        <i-switch :value.sync="vRoadGate.attendanceTakePhoto"
                  trueValue="1"
                  falseValue="0" />
      </div>
    </Item>
    <Item label="绑定场所"
          @click="onPlace">
      <div slot="remark">{{placeCategory.name}} {{vRoadGate.categoryName || '必填'}}</div>
    </Item>
    <div v-for="(v,i) in vRoadGate.vRoadGateBinds"
         :key="i">
      <div class="category-title">
        <span :class="{'error':v.isOnline === '0'}">{{v.outOrIn === '1' ? '入口' : '出口'}}</span>
        <div class="right"
             @click="onRestart(v)">重启</div>
        <div class="right"
             @click="onUnband(v,i)">解绑</div>
      </div>
      <Item label="序列号"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="v.code" />
      </Item>
      <!-- <Item label="MAC地址"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="v.uuid" />
      </Item>
      <Item label="UUID"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="v.macAddress" />
      </Item> -->
    </div>
    <div class="list-button">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="onRemove(u)"
                 v-if="isRemove">删除</el-button>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        placeCategory: {},
        vRoadGate: { vRoadGateBinds: [] }
      }
    },
    computed: {
      isRemove() {
        return (
          // 如果存在id，则代表还有未解绑的数据
          this.vRoadGate.vRoadGateBinds.filter(r => {
            return !!r.id
          }).length === 0
        )
      }
    },
    activated() {
      this.vRoadGate = this.getStorage('_cache_roadgate') || { vRoadGateBinds: [] }
      let cacheCategory = this.getStorage('_cache_category_place')
      if (!Check.isNullObject(cacheCategory)) {
        this.$set(this.vRoadGate, 'categoryId', cacheCategory.id)
        this.placeCategory = cacheCategory
      }
      let cachePlace = this.getStorage('_cache_place')
      if (!Check.isNullObject(cachePlace)) {
        this.$set(this.vRoadGate, 'placeId', cachePlace.id)
        this.$set(this.vRoadGate, 'categoryName', cachePlace.name)
      }
    },
    methods: {
      onSubmit() {
        if (Check.isNullString(this.vRoadGate.name)) {
          this.$message({ type: 'warning', message: '道闸名称不能为空' })
          return
        }
        if (Check.isNullString(this.vRoadGate.placeId)) {
          this.$message({ type: 'warning', message: '' })
          return
        }
        Api.modifyRoadgate({
          vRoadGate: {
            ...this.vRoadGate,
            schoolId: this.schoolId
          }
        }).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      },
      onPlace() {
        this.routePush({
          path: '/vx/group/place/category',
          query: {
            depth: 1,
            groupId: this.schoolId,
            type: 153
          }
        })
      },
      onRestart(v) {
        Api.restart(v.id).then(res => {
          this.$message({ type: 'success', message: '重启成功' })
        })
      },
      onUnband(v, i) {
        Api.unbind({ vRoadGateBind: { id: v.id } }).then(res => {
          this.$message({ type: 'success', message: '解绑成功' })
          this.$set(this.vRoadGate.vRoadGateBinds, i, { code: '', uuid: '', macAddress: '', outOrIn: '0' })
        })
      },
      onRemove() {
        Api.removeRoadgate(this.vRoadGate.id).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
