<template>
  <page :title="title"
        hasSubmit
        closePrompt
        @submit="handleSubmit">
    <item :hasClick="false"
          label="开始时间">
      <div slot="after">
        <el-date-picker v-model="form.startDate"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="必填"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <item :hasClick="false"
          label="结束时间">
      <div slot="after">
        <el-date-picker v-model="form.endDate"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="选填"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <template v-if="tp === 2">
      <item :hasClick="false"
            label="工作单位">
        <input slot="after"
               placeholder="必填"
               v-model="form.unit" />
      </item>
      <item :hasClick="false"
            label="职务">
        <input slot="after"
               placeholder="必填"
               v-model="form.job" />
      </item>
    </template>
    <template v-else>
      <item :hasClick="false"
            label="毕业院校">
        <input slot="after"
               placeholder="必填"
               v-model="form.school" />
      </item>
      <item :hasClick="false"
            label="专业">
        <input slot="after"
               placeholder="必填"
               v-model="form.major" />
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleItem">
        <div class="el-dropdown-link">
          <item label="学位"
                :remark="degreeTxt">
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in categories"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <TextInput placeholder="备注（100字以内）"
               max="100"
               v-model="form.remark"></TextInput>
    <div v-if="obj.resume"
         class="button button-common"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        form: {
          startDate: '',
          endDate: '',
          unit: '',
          job: '',
          school: '',
          remark: '',
          degree: null,
          major: ''
        },
        categories: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      tp() {
        return parseInt(this.obj.type)
      },
      title() {
        let txt = this.tp === 1 ? '教育背景' : '工作经历'
        return this.obj.resume ? `编辑${txt}` : `添加${txt}`
      },
      degreeTxt() {
        return this.form.degree ? this.form.degree.name : ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let resume = this.obj.resume
        if (resume) {
          this.form = {
            startDate: DateUtils.format(resume.startTime, DateUtils.YMD),
            endDate: DateUtils.format(resume.endTime, DateUtils.YMD),
            job: resume.job || '',
            unit: resume.workUnit || '',
            school: resume.schoolName || '',
            major: resume.major || '',
            degree: resume.degreeCategoryId
              ? {
                  id: resume.degreeCategoryId,
                  name: resume.degreeCategoryName
                }
              : null,
            remark: resume.remark || ''
          }
        }
        CategoryApi.getCategorysByTypes('136').then(res => {
          this.categories = res.categorys || []
        })
      },
      handleItem(item) {
        this.form.degree = item
      },
      handleSubmit() {
        let resume = this.obj.resume
        let form = this.form
        let tp = this.tp
        let postData = {
          userId: this.obj.userId,
          type: tp
        }
        if (Check.isNullString(form.startDate)) {
          this.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        postData.startTime = DateUtils.format_0800(form.startDate)

        if (!Check.isNullString(form.endDate) && new Date(form.startDate).getTime() > new Date(form.endDate).getTime()) {
          this.$message({ message: '结束时间必须大于开始时间', type: 'warning' })
          return false
        } else if (!Check.isNullString(form.endDate)) {
          postData.endTime = DateUtils.format_0800(form.endDate)
        }

        if (tp === 2) {
          if (Check.isNullString(form.unit)) {
            this.$message({ message: '工作单位不能为空', type: 'warning' })
            return false
          }
          postData.workUnit = form.unit
          if (Check.isNullString(form.job)) {
            this.$message({ message: '职务不能为空', type: 'warning' })
            return false
          }
          postData.job = form.job
        } else if (Check.isNullString(form.school)) {
          this.$message({ message: '毕业院校不能为空', type: 'warning' })
          return false
        } else {
          postData.schoolName = form.school
          if (form.degree) {
            postData.degreeCategoryId = form.degree.id
            postData.degreeCategoryName = form.degree.name
          }
        }
        if (resume) {
          postData.id = resume.id
        }
        if (!Check.isNullString(form.remark)) {
          postData.remark = form.remark
        }
        Api.modifyResume({
          curriculumVitaes: [postData]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        let resume = this.obj.resume
        let txt = this.tp === 1 ? '教育背景' : '工作经历'
        this.$confirm(`确定删除该${txt}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyResume({
            curriculumVitaes: [
              {
                id: resume.id,
                status: 'd'
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
