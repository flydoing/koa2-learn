<template>
  <page title="班级详情"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <!-- 校区 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showCampus">
      <Scroller :height="300">
        <Item v-for="(item, i) in campuses"
              :key="i"
              @click="selectCampus(item)"
              :label="item.name">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="校区"
            :remark="campusTxt">
      </Item>
    </el-popover>
    <!-- 入学 -->
    <item label="入学">
      <div slot="remark">
        <el-popover placement="bottom-end"
                    width="400"
                    trigger="click"
                    v-model="showPeriod">
          <Scroller :height="300">
            <Item v-for="(item, i) in periods"
                  :key="i"
                  @click="selectPeriod(item)"
                  :label="item.name">
            </Item>
          </Scroller>
          <span slot="reference">{{form.period ? form.period.name : '学段'}}</span>
        </el-popover>
        &#12288;
        <el-popover placement="bottom-end"
                    width="400"
                    trigger="click"
                    v-model="showYear">
          <Scroller :height="300">
            <Item v-for="(item, i) in years"
                  :key="i"
                  @click="selectYear(item)"
                  :label="item.name">
            </Item>
          </Scroller>
          <span slot="reference"
                v-html="yearTxt">
          </span>
        </el-popover>
      </div>
    </item>
    <!-- 属性 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showProperty">
      <Scroller :height="300">
        <Item v-for="(item, i) in properties"
              :key="i"
              @click="selectProperty(item)"
              :label="item.name">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="属性"
            :remark="propertyTxt">
      </Item>
    </el-popover>
    <!-- 系统名称 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showSys">
      <Scroller :height="300">
        <Item v-for="(item, i) in systems"
              :key="i"
              @click="selectSys(item)"
              :label="item.defaultName">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="系统名称"
            @click="handleSys"
            :remark="sysTxt">
      </Item>
    </el-popover>
    <item :hasClick="false"
          label="班级昵称">
      <input slot="remark"
             placeholder="选填"
             v-model="form.name" />
    </item>
    <item @click="handleTeacher"
          label="班主任">
      <div slot="remark"
           class="ellipsis"
           v-html="teacherTxt"></div>
    </item>
    <div class="button button-common"
         v-if="form.groupId"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from '../api'
  import CategoryApi from '@/api/category'
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          campus: null,
          period: null,
          year: null,
          sys: null,
          property: null,
          teachers: []
        },
        campuses: [],
        periods: [],
        years: [],
        properties: [],
        systems: [],
        showCampus: false,
        showPeriod: false,
        showSys: false,
        showProperty: false,
        showYear: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      campusTxt() {
        let campus = this.form.campus || {}
        return campus.name || '必填'
      },
      yearTxt() {
        let year = this.form.year || {}
        return year.name || '年份'
      },
      sysTxt() {
        let sys = this.form.sys || {}
        return sys.defaultName || '必填'
      },
      propertyTxt() {
        let property = this.form.property || {}
        return property.name || '必填'
      },
      teacherTxt() {
        let teachers = this.form.teachers
        if (Check.isRealArray(teachers)) {
          let ts = teachers.filter(v => {
            return v.status !== 'd'
          })
          return ts
            .map(v => {
              return v.name
            })
            .join('、')
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let cache = this.obj.classCache
        if (this.obj.classForm) {
          this.form = { ...this.obj.classForm }
          if (this.obj.teachers) {
            this.form.teachers = this.obj.teachers
            this.modifyCreateObjectField('teachers')
          }
          this.modifyCreateObjectField('classForm')
        } else if (cache) {
          let property = {
            status: 'd',
            name: '行政班'
          }
          if (cache.meta) {
            property = {
              id: cache.meta.key,
              name: cache.meta.obj
            }
          }

          this.form = {
            ...cache,
            campus: {
              name: cache.campus,
              groupId: cache.campusId
            },
            sys: {
              defaultNo: cache.defaultNo,
              defaultName: cache.defaultName || '新班级'
            },
            property: property,
            teachers: cache.relations || []
          }
        }
        this.modifyCreateObjectField('classCache')

        GroupApi.getSchoolCampus(this.currentGroup.parentId).then(res => {
          this.campuses = res.groups || []
        })
        CategoryApi.getCategorys({ type: 165 }).then(res => {
          if (res.categorys) {
            this.properties = [
              ...res.categorys,
              {
                status: 'd',
                name: '行政班'
              }
            ]
          }
        })
        CategoryApi.getCategorys({ type: 3 }).then(res => {
          this.periods = res.categorys || []
          if (cache) {
            this.periods.forEach(v => {
              if (v.status === cache.gradeType) {
                this.form.period = v
              }
            })
          }
        })
        let max = new Date().getFullYear()
        let min = max - 20
        for (; max >= min; max--) {
          let y = { name: `${max}级`, value: max }
          this.years.push(y)
          if (cache && cache.year === max.toString()) {
            this.form.year = y
          }
        }
      },
      selectCampus(item) {
        this.showCampus = false
        this.form.campus = item
      },
      selectPeriod(item) {
        this.showPeriod = false
        this.form.period = item
      },
      selectYear(item) {
        this.showYear = false
        this.form.year = item
      },
      selectProperty(item) {
        this.showProperty = false
        this.form.property = item
      },
      selectSys(item) {
        this.showSys = false
        this.form.sys = item
      },
      handleSys() {
        if (!this.showSys) {
          let form = this.form
          if (!form.campus) {
            this.$message({ message: '请选择校区', type: 'warning' })
            return false
          }
          if (!form.period) {
            this.$message({ message: '请选择学段', type: 'warning' })
            return false
          }
          if (!form.year) {
            this.$message({ message: '请选择年份', type: 'warning' })
            return false
          }

          Api.getSystemNames({
            addFlag: form.id ? '0' : '1',
            campusId: form.campus.groupId,
            gradeType: form.period.status,
            year: form.year.value
          }).then(res => {
            if (res.groups) {
              this.systems = res.groups.map(v => {
                v.defaultName = v.defaultName || '新班级'
                return v
              })
            }
            this.showSys = true
          })
        }
      },
      handleTeacher() {
        this.setCreateObject({ classForm: this.form, teachers: this.form.teachers })
        this.routePush({ path: '/vx/group/business/1147/classStep/addMember' })
      },
      handleSubmit() {
        let form = this.form
        if (!form.campus) {
          this.$message({ message: '请选择校区', type: 'warning' })
          return false
        }
        if (!form.period) {
          this.$message({ message: '请选择学段', type: 'warning' })
          return false
        }
        if (!form.year) {
          this.$message({ message: '请选择年份', type: 'warning' })
          return false
        }
        if (!form.property) {
          this.$message({ message: '请选择属性', type: 'warning' })
          return false
        }
        if (!form.sys) {
          this.$message({ message: '请选择系统名称', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.teachers)) {
          this.$message({ message: '请选择班主任', type: 'warning' })
          return false
        }

        let meta = null
        if (form.property.id) {
          meta = {
            key: form.property.id,
            obj: form.property.name
          }
        } else {
          meta = { status: 'd' }
        }

        let postData = {
          name: form.name,
          type: '2',
          year: form.year.value,
          orgType: form.period.status,
          schoolId: this.currentGroup.parentId,
          campusId: form.campus.groupId,
          defaultName: form.sys.defaultName,
          defaultNo: form.sys.defaultNo,
          groupId: form.groupId || void 0
        }
        if (form.meta) {
          postData.meta = meta
        }
        Api.modifyClassInfo({
          group: postData,
          relations: form.teachers.map(v => {
            if (v.status === 'd') {
              return { userId: v.userId, status: 'd' }
            }
            return {
              name: v.name,
              userId: v.userId,
              userType: v.userType,
              type: '1',
              isHeadteacher: '1'
            }
          })
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该班级？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyClassInfo({
            group: {
              groupId: this.form.groupId,
              status: 'd'
            }
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
