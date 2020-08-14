<template>
  <page title="老师信息"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          label="老师姓名">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <item :hasClick="false"
          label="手机号码">
      <input slot="remark"
             placeholder="必填"
             v-model="form.mobile" />
    </item>
    <!-- 任教科目 -->
    <item @click="handleSubject"
          label="任教科目">
      <div slot="remark"
           class="ellipsis"
           v-html="subjectTxt"></div>
    </item>
    <!-- 校区 -->
    <item @click="handleCampus"
          label="所在校区">
      <div slot="remark"
           class="ellipsis"
           v-html="campusTxt"></div>
    </item>
    <div class="category-title text">同一天两节任课的之间的时间尽可能靠近，且优先安排在上午任课。</div>
    <item label="优先排课">
      <div slot="after">
        <i-switch :value="isSwitched"
                  @click="handleSwitch"></i-switch>
      </div>
    </item>
    <div class="button button-common"
         v-if="form.userId"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          campuses: [],
          subjects: [],
          priority: 0,
          name: '',
          mobile: ''
        }
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
        if (Check.isRealArray(this.form.campuses)) {
          let campuses = this.form.campuses.map(v => {
            return v.name
          })
          return campuses.join('、')
        }
        return '必填'
      },
      subjectTxt() {
        if (Check.isRealArray(this.form.subjects)) {
          let subjects = this.form.subjects.map(v => {
            return v.name
          })
          return subjects.join('、')
        }
        return '必填'
      },
      isSwitched() {
        return this.form.priority === 1
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let cache = this.obj.teacherCache
        if (this.obj.teacherForm) {
          this.form = { ...this.obj.teacherForm }
          if (this.obj.subjects) {
            this.form.subjects = this.obj.subjects
            this.modifyCreateObjectField('subjects')
          }
          if (this.obj.campuses) {
            this.form.campuses = this.obj.campuses
            this.modifyCreateObjectField('campuses')
          }
          this.modifyCreateObjectField('teacherForm')
        } else if (cache) {
          this.form = { ...cache, subjects: cache.courses, campuses: cache.campus }
        }
        this.modifyCreateObjectField('teacherCache')
      },
      handleCampus(item) {
        this.setCreateObject({ teacherForm: this.form, campuses: this.form.campuses })
        this.routePush({ path: '/vx/group/business/1147/teacherStep/selectCampus' })
      },
      handleSwitch() {
        let priority = this.form.priority
        this.form.priority = priority === 1 ? 0 : 1
      },
      handleSubject() {
        this.setCreateObject({ teacherForm: this.form, subjects: this.form.subjects })
        this.routePush({ path: '/vx/group/business/1147/teacherStep/selectSubject' })
      },
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.name)) {
          this.$message({ message: '姓名不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.mobile)) {
          this.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.subjects)) {
          this.$message({ message: '请选择任教科目', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.campuses)) {
          this.$message({ message: '请选择校区', type: 'warning' })
          return false
        }

        let postData = {
          name: form.name,
          mobile: form.mobile,
          courses: form.subjects,
          campus: form.campuses,
          priority: form.priority,
          userId: form.userId || void 0,
          schoolId: this.currentGroup.parentId
        }
        Api.modifyTeacherInfo({
          teachers: [postData]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该老师？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyTeacherInfo({
            teachers: [
              {
                userId: this.form.userId,
                status: 'd',
                schoolId: this.currentGroup.parentId
              }
            ]
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
