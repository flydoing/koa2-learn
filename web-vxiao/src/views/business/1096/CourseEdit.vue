<template>
  <page title="课程信息"
        @submit="handleSubmit"
        hasSubmit>
    <div class="course-edit">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item @click="handleSpace">
        <div slot="main">
          <div>关联空间</div>
          <div class="remark-text">关联后会沿用已选空间</div>
        </div>
        <div slot="remark"
             v-html="propTxt(form.group, false)"></div>
      </item>
      <item @click="handleTeacher">
        <div slot="main">老师</div>
        <div slot="remark"
             v-html="propTxt(form.teachers, true)"
             class="ellipsis"></div>
      </item>
      <item @click="handleTime">
        <div slot="main">上课时间</div>
        <div slot="remark"
             v-html="timeTxt"
             class="ellipsis"></div>
      </item>
      <item @click="handleClass">
        <div slot="main">适选班级</div>
        <div slot="remark"
             v-html="propTxt(form.classes, true)"
             class="ellipsis"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">人数上限</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.upperLimit" />
      </item>
      <item @click="handlePlace">
        <div slot="main">上课地点</div>
        <div slot="remark"
             v-html="propTxt(form.place, false)"></div>
      </item>
      <keep-alive>
        <EditorSimple placeholder="简介（选填）"
                      :store.sync="form"
                      :toolbars="['photo']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          group: null,
          teachers: [],
          classes: [],
          periods: [],
          upperLimit: '',
          place: null,
          content: '',
          medias: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      }),
      timeTxt() {
        if (Check.isRealArray(this.form.periods)) {
          return this.form.periods
            .map(v => {
              return `${v.dayName} ${v.sectionName}`
            })
            .join('、')
        }
        return '必填'
      }
    },
    methods: {
      ...mapActions(['setSelection']),
      propTxt(data, validate) {
        if (Check.isRealArray(data)) {
          return data
            .map(v => {
              return v.name || v.userName || v.groupName
            })
            .join('、')
        }
        if (!Check.isArray(data) && Check.isObject(data)) {
          return data.name
        }
        return validate ? '必填' : '选填'
      },
      fetchData() {
        if (this.selection.courseForm) {
          this.form = JSON.parse(JSON.stringify(this.selection.courseForm))
          if (this.selection.space) {
            this.form.group = this.selection.space
          }
          if (this.selection.place) {
            this.form.place = this.selection.place
          }
          if (Check.isRealArray(this.selection.classes)) {
            this.form.classes = this.selection.classes
          }
          if (Check.isRealArray(this.selection.teachers)) {
            this.form.teachers = this.selection.teachers
          }
          if (Check.isRealArray(this.selection.periods)) {
            this.form.periods = this.selection.periods
          }
          if (this.form.logo && !Check.isRealArray(this.form.medias)) {
            this.form.medias = [{ fileId: this.form.logo, type: 'photo' }]
          }
        }
      },
      handleSpace() {
        this.setSelection({ courseForm: this.form, space: this.form.space })
        this.routePush({ name: 'selectSpace1096' })
      },
      handleTeacher() {
        this.setSelection({ courseForm: this.form, teachers: this.form.teachers })
        this.routePush({ name: 'selectTeacher1096' })
      },
      handleTime() {
        this.setSelection({ courseForm: this.form, periods: this.form.periods })
        this.routePush({ name: 'selectTime1096' })
      },
      handleClass() {
        this.setSelection({ courseForm: this.form, classes: this.form.classes })
        this.routePush({ name: 'selectClass1096' })
      },
      handlePlace() {
        this.setSelection({ courseForm: this.form, space: this.form.place })
        this.routePush({ name: 'selectPlace1096' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (Check.isNullString(form.name)) {
          that.$message({ type: 'warning', message: '名称不能为空' })
          return false
        }
        if (!Check.isRealArray(form.teachers)) {
          that.$message({ type: 'warning', message: '请选择老师' })
          return false
        }
        if (!Check.isRealArray(form.periods)) {
          that.$message({ type: 'warning', message: '请选择上课时间' })
          return false
        }
        if (!Check.isRealArray(form.classes)) {
          that.$message({ type: 'warning', message: '请选择适选班级' })
          return false
        }
        if (Check.isNullString(form.upperLimit)) {
          that.$message({ type: 'warning', message: '人数上限不能为空' })
          return false
        }

        let postData = {
          name: form.name,
          upperLimit: form.upperLimit,
          periods: form.periods.map(v => {
            return {
              dayOfWeek: v.dayOfWeek,
              dayName: v.dayName,
              sectionIndex: v.sectionIndex,
              sectionName: v.sectionName
            }
          }),
          classes: form.classes.map(v => {
            return {
              campus: v.campus,
              gradeGroupId: v.gradeId || v.gradeGroupId,
              gradeName: v.extension || v.gradeName,
              groupId: v.groupId,
              groupName: v.name || v.groupName
            }
          }),
          teachers: form.teachers.map(v => {
            return {
              userId: v.userId,
              userName: v.name || v.userName
            }
          }),
          version: that.selection.version,
          description: form.content
        }

        if (form.id) {
          postData.id = form.id
        }
        if (form.place) {
          postData.placeId = form.place.id
          postData.placeName = form.place.name
        }
        if (form.group) {
          postData.groupId = form.group.groupId
          postData.groupName = form.group.name || form.group.groupName
        }
        if (Check.isRealArray(form.medias)) {
          postData.logo = form.medias[0].fileId
        }
        Api.modifyCourse(that.currentGroup.parentId, [postData]).then(res => {
          that.$message({ type: 'success', message: '操作成功' })
          that.setSelection({ periods: [], teachers: [], place: null, space: null, classes: [] })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .course-edit {
    .remark-text {
      font-size: rem(12);
      color: #999;
    }
  }
</style>
