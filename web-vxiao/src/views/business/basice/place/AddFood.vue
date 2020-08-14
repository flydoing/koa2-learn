<template>
  <Page :title="title"
        hasSubmit
        @submit="submit">
    <el-popover placement="bottom-end"
                width="400"
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
        <div slot="remark">{{campus.name?campus.name:'必填'}}</div>
      </Item>
    </el-popover>
    <Item @click="selectFood">
      <div>食堂</div>
      <div slot="remark">{{foodCategory.name?foodCategory.name:'必填'}}</div>
    </Item>
    <Item :hasClick="false">
      <div>窗口名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="place.name" />
    </Item>
    <Item @click="handleAdmin">
      <div slot="main">管理员</div>
      <div slot="remark"
           v-html="adminTxt"></div>
    </Item>
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
  import Check from '@/utils/check'
  import Api from '../api'
  import GroupApi from '@/api/group'
  export default {
    data() {
      return {
        campus: {},
        campusList: [],
        foodCategory: {},
        place: { name: '' },
        showCampus: false
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
        this.campus = {
          id: place.cid,
          name: place.cname
        }
        this.foodCategory = {
          id: place.canteenCategoryId,
          name: place.canteenName
        }
        if (Check.isRealArray(place.managers)) {
          place.managers = place.managers.map(v => {
            v.name = v.name || v.userName
            return v
          })
        }
        this.place = place
      }

      let cache = this.getStorage('food_place_cache')
      if (cache) {
        this.foodCategory = cache.foodCategory
        this.place = cache.place
        this.campus = cache.campus
      }

      let foodCategory = this.getStorage('_cache_food')
      if (!Check.isNull(foodCategory)) {
        this.foodCategory = foodCategory
      }

      GroupApi.getSchoolGroupsByType(this.routeQuery('schoolId'), '4').then(res => {
        this.campusList = res.groups
      })
    },
    methods: {
      submit() {
        if (!this.campus.id) {
          this.$message({ type: 'warning', message: '请选择校区' })
          return
        }
        if (!this.foodCategory.id) {
          this.$message({ type: 'warning', message: '食堂不能为空' })
          return
        }
        if (Check.isNullString(this.place.name)) {
          this.$message({ type: 'warning', message: '窗口名称不能为空' })
          return
        }

        let place = this.place
        let postData = {
          name: place.name,
          cid: this.campus.id,
          canteenCategoryId: this.foodCategory.id,
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
        this.campus = c
      },
      selectFood() {
        this.setStorage('food_place_cache', {
          campus: this.campus,
          foodCategory: this.foodCategory,
          place: this.place
        })
        this.routePush({
          name: 'basicePlaceFoodSelect',
          query: this.$route.query
        })
      },
      handleAdmin() {
        this.setStorage('_cache_place_', this.place)
        this.routePush({ name: 'basicePlaceAdmins' })
      }
    }
  }
</script>
