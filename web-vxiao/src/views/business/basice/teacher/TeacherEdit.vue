<template>
  <Page title="老师信息"
        hasSubmit
        @submit="submit">
    <Item :hasClick="false">
      <div>老师姓名</div>
      <input slot="remark"
             placeholder="必填"
             v-model="teacher.name" />
    </Item>
    <Item :hasClick="false">
      <div>手机号码</div>
      <input slot="remark"
             placeholder="必填"
             v-model.number="teacher.mobile"
             maxlength="11" />
    </Item>
    <div class="category-title"></div>
    <Item @click="selectCourses">
      <div>任教科目</div>
      <div slot="remark"
           class="ellipsis">{{teacher.courses | arrayNameToString}}</div>
    </Item>
    <Item :hasClick="false">
      <div>职位</div>
      <div slot="remark"
           class="ellipsis">{{teacher.jobs | arrayNameToString}}</div>
    </Item>
    <el-popover placement="right-start"
                width="300"
                v-model="showCampus">
      <Item v-for="(campus,i) in campusList"
            :key="i"
            :hasArrow="false"
            @click="selectCampus(campus)">
        <div slot="before"><i :class="prefixCampus(campus)"></i></div>
        <div>{{campus.name}}</div>
      </Item>
      <div style="text-align: right; margin-top: 10px">
        <el-button size="mini"
                   type="text"
                   @click="showCampus = false">取消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="confirmCampus">确定</el-button>
      </div>
      <Item slot="reference">
        <div>所在校区</div>
        <div slot="remark"
             class="ellipsis">{{teacher.campus | arrayNameToString}}</div>
      </Item>
    </el-popover>
    <Item @click="onGroup">
      <div>所在群组</div>
      <div slot="remark"
           class="ellipsis">{{teacher.groups | arrayNameToString}}</div>
    </Item>
    <!-- <div class="category-title text">简介</div>
    <TextInput placeholder="简介内容"
               :max="200"
               v-model="teacher.introduction" />
    <Item>
      <div>优先排课</div>
      <div slot="after">
        <i-switch :value.sync="teacher.priority"
                  :trueValue='1'
                  :falseValue="0"></i-switch>
      </div>
    </Item> -->
    <div class="list-button">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="remove">删除</el-button>
    </div>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  export default {
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve)
    },
    data() {
      return {
        schoolId: '',
        teacher: {},
        showCampus: false,
        campusList: [],
        checkCampus: {}
      }
    },
    created() {
      this.teacher = this.getStorage('_cache_teacher') || {}
    },
    activated() {
      this.schoolId = this.routeQuery('schoolId') || this.routeQuery('extension')
      let cacheTeacher = this.getStorage('_cache_teacher')
      // 如果存在，则赋值，否则不做任何操作（重要，避免返回数据会清空）
      if (cacheTeacher) {
        this.teacher = cacheTeacher
      }
      let cacheCourse = this.getStorage('_cache_course')
      if (cacheCourse) {
        this.$set(this.teacher, 'courses', cacheCourse)
      }
      let cacheGroups = this.getStorage('_cache_groups')
      if (cacheGroups) {
        this.$set(
          this.teacher,
          'groups',
          (gs => {
            let g = []
            gs.forEach(_g => {
              g.push({
                name: _g.name,
                groupId: _g.groupId
              })
            })
            return g
          })(cacheGroups)
        )
      }
      Api.getSchoolCampus(this.schoolId).then(res => {
        this.campusList = res.groups || []
      })
    },
    methods: {
      remove() {
        this.$confirm(`确认删除 ${this.teacher.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              // 修改老师信息
              this.$http
                .post('/base/school/teacher/modify', {
                  teachers: [
                    {
                      userId: this.teacher.userId,
                      schoolId: this.schoolId,
                      status: 'd'
                    }
                  ]
                })
                .then(res => {
                  done()
                  instance.confirmButtonLoading = false
                  this.$message({ type: 'success', message: '删除成功' })
                  this.routeBack()
                })
            } else {
              done()
            }
          }
        })
      },
      submit() {
        if (Check.isNullString(this.teacher.name)) {
          this.$message({ type: 'warning', message: '老师名称不能为空' })
          return
        }
        if (Check.isNullString(this.teacher.mobile)) {
          this.$message({ type: 'warning', message: '手机号码不能为空' })
          return
        }
        // if (!Check.isRealArray(this.teacher.campus)) {
        //   this.$message({ type: 'warning', message: '所在校区不能为空' })
        //   return
        // }
        // 修改老师信息
        this.$http.post('/base/school/teacher/modify', { teachers: [this.teacher] }).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      },
      confirmCampus() {
        this.showCampus = false
        this.$set(this.teacher, 'campus', Object.values(this.checkCampus))
      },
      selectCourses() {
        this.setStorage('_cache_course', this.teacher.courses)
        this.routePush({
          path: '/vx/group/course/select'
        })
      },
      selectCampus(c) {
        if (this.checkCampus[c.groupId]) {
          this.$delete(this.checkCampus, c.groupId)
        } else {
          this.$set(this.checkCampus, c.groupId, {
            groupId: c.groupId,
            name: c.name
          })
        }
      },
      prefixCampus(c) {
        return [
          `ico ico-select`,
          {
            [`active`]: !!this.checkCampus[c.groupId]
          }
        ]
      },
      onGroup(c) {
        this.setStorage('_cache_groups', this.teacher.groups)
        this.routePush({
          name: 'basiceTeacherGroups'
        })
      }
    },
    watch: {
      teacher(v) {
        if (v.campus) {
          v.campus.forEach(c =>
            this.$set(this.checkCampus, c.groupId, {
              groupId: c.groupId,
              name: c.name
            })
          )
        }
      }
    }
  }
</script>
