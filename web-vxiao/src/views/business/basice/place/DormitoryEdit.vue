<template>
  <page title="宿舍"
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false">
      <div slot="main">宿舍名称</div>
      <input slot="remark"
             placeholder="输入内容"
             v-model="form.name" />
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleFloor">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">楼层</div>
          <div slot="remark"
               v-html="floorTxt"></div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in floors"
                          :key="i"
                          :way="item"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item @click="handleBuilding">
      <div slot="main">宿舍楼</div>
      <div slot='remark'
           v-html="buildingTxt"></div>
    </item>
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showCampus">

      <Item v-for="(item, i) in campuses"
            :key="i"
            @click="handleCampus(item)">
        <div>{{item.name}}</div>
      </Item>
      <Item slot="reference">
        <div>校区</div>
        <div slot="remark"
             v-html="campusTxt"></div>
      </Item>
    </el-popover>
    <Item @click="handleAdmin">
      <div slot="main">管理员</div>
      <div slot="remark"
           v-html="adminTxt"></div>
    </Item>
    <div v-if="form.id"
         class="button button-common"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          floor: null,
          building: null,
          campus: null
        },
        campuses: [],
        floors: [
          {
            name: '一层'
          },
          {
            name: '二层'
          },
          {
            name: '三层'
          },
          {
            name: '四层'
          },
          {
            name: '五层'
          },
          {
            name: '六层'
          },
          {
            name: '七层'
          },
          {
            name: '八层'
          },
          {
            name: '九层'
          },
          {
            name: '十层'
          }
        ],
        showCampus: false
      }
    },
    computed: {
      floorTxt() {
        return this.form.floor ? this.form.floor.name : ''
      },
      buildingTxt() {
        return this.form.building ? this.form.building.name : ''
      },
      campusTxt() {
        return this.form.campus ? this.form.campus.name : ''
      },
      adminTxt() {
        if (Check.isRealArray(this.form.managers)) {
          return `${this.form.managers.length}人`
        }
        return ''
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let cache = this.getStorage('_cache_place_')
        let form = this.getStorage('_dormitory_cache')
        if (cache) {
          this.form = {
            ...cache,
            campus: cache.campus
              ? cache.campus
              : {
                  id: cache.cid,
                  name: cache.cname
                },
            floor: cache.floor
              ? cache.floor
              : {
                  name: cache.floorNum
                },
            building: cache.building
              ? cache.building
              : {
                  name: cache.floorName
                }
          }
          if (Check.isRealArray(cache.managers)) {
            this.form.managers = cache.managers.map(v => {
              v.name = v.name || v.userName
              return v
            })
          }
        } else if (form) {
          this.form = { ...form }
        }

        let building = this.getStorage('_dormitory_category_cache')
        if (building) {
          this.form.building = building
        }

        GroupApi.getSchoolGroupsByType(this.currentGroup.parentId, '4').then(res => {
          this.campuses = res.groups
        })
      },
      handleCampus(item) {
        this.form.campus = item
        this.showCampus = false
      },
      handleBuilding(item) {
        this.setStorage('_dormitory_cache', this.form)
        this.routePush({ name: 'basiceDormitoryCategory' })
      },
      handleFloor(item) {
        this.form.floor = item
      },
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.name)) {
          this.$message({ message: '宿舍名称不能为空', type: 'warning' })
          return false
        }
        if (!form.building) {
          this.$message({ message: '请选择宿舍楼', type: 'warning' })
          return false
        }
        if (!form.campus) {
          this.$message({ message: '请选择校区', type: 'warning' })
          return false
        }

        let postData = {
          cid: form.campus.id,
          name: form.name,
          categoryId: this.routeQuery('id'),
          type: this.routeQuery('type'),
          schoolId: this.currentGroup.parentId,
          floorNum: form.floor ? form.floor.name : '',
          floorName: form.building.name,
          floorId: form.building.id
        }
        if (Check.isRealArray(form.managers)) {
          postData.managers = form.managers.map(v => {
            return {
              userId: v.userId
            }
          })
        }
        if (form.id) {
          postData.id = form.id
        }

        Api.modifyPlace({ places: [postData] }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该宿舍？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyPlace({
            places: [
              {
                id: this.form.id,
                status: 'd'
              }
            ]
          }).then(res => {
            this.$message({ type: 'success', message: '添加成功' })
            this.routeBack()
          })
        })
      },
      handleAdmin() {
        this.setStorage('_cache_place_', this.form)
        this.routePush({ name: 'basicePlaceAdmins' })
      }
    }
  }
</script>
