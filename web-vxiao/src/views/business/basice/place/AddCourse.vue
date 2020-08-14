<template>
  <Page :title="title"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>场所名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="place.name" />
    </Item>
    <Item :hasClick="false">
      <div>楼宇</div>
      <input slot="remark"
             placeholder="必填"
             v-model="place.floorName" />
    </Item>
    <el-popover placement="bottom-end"
                width="300"
                trigger="click"
                v-model="showCampus">
      <div class="vx-emojis">
        <Item v-for="c in campusList"
              :key="c.id"
              @click="selectCampus(c)">
          <div>{{c.name}}</div>
        </Item>
      </div>
      <Item slot="reference">
        <div>校区</div>
        <div slot="remark">{{bandCampus.name?bandCampus.name:'必填'}}</div>
      </Item>
    </el-popover>
    <el-popover placement="bottom-end"
                width="300"
                trigger="click"
                v-model="showGroups">
      <Scroller :height="500">
        <Item v-for="c in groups"
              :key="c.id"
              @click="selectGroups(c)">
          <div>{{c.name}}</div>
        </Item>
        <Item @click="selectGroups({name: '无（公共场所）'})">
          <div>无（公共场所）</div>
        </Item>
      </Scroller>
      <Item slot="reference">
        <div>常驻班级</div>
        <div slot="remark">{{bandGroup.name ? bandGroup.name : '无（公共场所）'}}</div>
      </Item>
    </el-popover>
    <Item @click="handleAdmin">
      <div slot="main">管理员</div>
      <div slot="remark"
           v-html="adminTxt"></div>
    </Item>
    <!-- <Item @class="subject">
      <div>科目限定</div>
      <div slot="remark">不限</div>
    </Item> -->
    <!-- <div class="category-title">容纳班数</div> -->
    <!-- <div class="pd">
      <el-slider v-model="place.maxClass" :max="20" :min="1" show-stops/>
    </div> -->
    <div class="list-button"
         v-if="place.id">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="clickRemove">删除</el-button>
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
        bandGroup: {},
        bandCampus: {},
        bandCategory: {},
        place: {
          name: '',
          floorName: ''
        },
        groups: [],
        campusList: [],
        showCampus: false,
        showGroups: false,
        showTypes: false
      }
    },
    computed: {
      title() {
        let name = this.routeQuery('title')
        return this.place.id ? `${name}信息` : `新增${name}`
      },
      adminTxt() {
        if (Check.isRealArray(this.place.managers)) {
          return `${this.place.managers.length}人`
        }
        return ''
      }
    },
    created() {
      let place = this.getStorage('_cache_place_')
      if (place) {
        this.bandCampus = {
          id: place.cid,
          name: place.cname
        }
        if (place.groupId) {
          this.bandGroup = {
            groupId: place.groupId,
            name: place.groupName
          }
        }
        if (Check.isRealArray(place.managers)) {
          place.managers = place.managers.map(v => {
            v.name = v.name || v.userName
            return v
          })
        }
        this.place = place
      }
      Api.loadCommonGroups(this.routeQuery('schoolId')).then(res => {
        this.groups = res.groups
      })
      GroupApi.getSchoolGroupsByType(this.routeQuery('schoolId'), '4').then(res => {
        this.campusList = res.groups
      })
    },
    methods: {
      submit() {
        if (Check.isNullString(this.place.name)) {
          this.$message({ type: 'warning', message: '场所名称不能为空' })
          return
        }
        if (Check.isNullString(this.place.floorName)) {
          this.$message({ type: 'warning', message: '楼宇不能为空' })
          return
        }
        if (!this.bandCampus.id) {
          this.$message({ type: 'warning', message: '请选择校区' })
          return
        }

        let place = this.place
        let postData = {
          cid: this.bandCampus.id,
          name: place.name,
          floorName: place.floorName,
          categoryId: this.routeQuery('id'),
          type: this.routeQuery('type'),
          schoolId: this.routeQuery('schoolId')
        }
        if (Check.isRealArray(place.managers)) {
          postData.managers = place.managers.map(v => {
            return {
              userId: v.userId
            }
          })
        }
        if (place.id) {
          postData.id = place.id
        }
        if (this.bandGroup.id) {
          postData.groupId = this.bandGroup.groupId
        }
        Api.modifyPlace({ places: [postData] }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      },
      clickRemove() {
        Api.modifyPlace({
          places: [
            {
              id: this.place.id,
              status: 'd'
            }
          ]
        }).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.routeBack()
        })
      },
      selectCampus(c) {
        this.showCampus = false
        this.bandCampus = c
      },
      selectGroups(c) {
        this.showGroups = false
        this.bandGroup = c
      },
      handleAdmin() {
        this.setStorage('_cache_place_', this.place)
        this.routePush({ name: 'basicePlaceAdmins' })
      }
    }
  }
</script>
