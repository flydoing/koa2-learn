<template>
  <Page title="场所详情" hasSubmit @submit="submit">
    <el-popover placement="bottom-end" width="400" trigger="click" v-model="showCampus">
      <div class="vx-emojis">
        <Item v-for="c in campusList" :key="c.id" @click="selectCampus(c)">
          <div>{{c.name}}</div>
        </Item>
      </div>
      <Item slot="reference">
        <div>校区</div>
        <div slot="remark">{{ campus.name ? campus.name : '必填'}}</div>
      </Item>
    </el-popover>
    <Item :hasClick="false">
      <div>名称</div>
      <input slot="remark" placeholder="必填" v-model="place.name" />
    </Item>
    <div class="list-button">
      <el-button type="danger" icon="el-icon-delete" size="medium" @click="clickRemove">删除</el-button>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        campus: {},
        campusList: [],
        showCampus: false,
        place: {}
      }
    },
    created() {
      this.place = this.getStorage('_cache_place_') || {}
      this.campus = {
        id: this.place.cid,
        name: this.place.cname
      }
      GroupApi.getSchoolGroupsByType(this.routeQuery('schoolId'), '4').then(res => {
        this.campusList = res.groups
      })
    },
    methods: {
      submit() {
        if (!this.campus.id) {
          this.$message({ type: 'warning', message: '请先选择校区' })
          return
        }
        if (Check.isNullString(this.place.name)) {
          this.$message({ type: 'warning', message: '名称不能为空' })
          return
        }
        Api.modifyPlace({
          places: [{
            id: this.place.id,
            cid: this.campus.id,
            type: this.routeQuery('type'),
            categoryId: this.routeQuery('id'),
            schoolId: this.routeQuery('schoolId'),
            name: this.place.name
          }]
        }).then(res => {
          this.$message({ type: 'success', message: '修改成功成功' })
          this.routeBack()
        })
      },
      clickRemove() {
        Api.modifyPlace({
          places: [{
            id: this.place.id,
            status: 'd'
          }]
        }).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.routeBack()
        })
      },
      selectCampus(c) {
        this.showCampus = false
        this.campus = c
      }
    }
  }

</script>
