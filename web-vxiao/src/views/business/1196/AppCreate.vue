<template>
  <page title="新建学生评估"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="student-appraisal-create">
      <item :hasClick="false"
            class="full-input">
        <input placeholder="评估名称"
               v-model="form.name" />
      </item>
      <item @click="handleRange">
        <div slot="main">评估范围</div>
        <div slot="remark"
             v-html="rangeTxt"></div>
      </item>
      <item class="sa-time"
            :hasClick="false">
        <div slot="main">截止时间</div>
        <div slot="after">
          <el-date-picker v-model="form.deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item @click="handleCase">
        <div slot="main">评估方案</div>
        <div slot="remark"
             v-html="caseTxt"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          deadline: '',
          ranges: [],
          aplCase: null
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getStudentAppraisal'
      }),
      rangeTxt() {
        let rs = this.form.ranges
        return rs.length > 0 ? `${rs.length}个年级` : ''
      },
      caseTxt() {
        return this.form.aplCase ? this.form.aplCase.name : '请选择'
      }
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fetchData() {
        const that = this
        if (that.appraisal.form) {
          that.form = { ...that.appraisal.form }

          if (that.appraisal.ranges) {
            that.form.ranges = that.appraisal.ranges
          }

          if (that.appraisal.aplCase) {
            that.form.aplCase = that.appraisal.aplCase
          }
        }
      },
      handleRange() {
        this.setStudentAppraisal({ form: this.form, ranges: this.form.ranges })
        this.routePush({ name: 'selectRange1196' })
      },
      handleCase() {
        this.setStudentAppraisal({ form: this.form, aplCase: this.form.aplCase })
        this.routePush({ name: 'selectCase1196' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '评估名称不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.ranges)) {
          that.$message({ message: '请选择评估范围', type: 'warning' })
          return false
        }

        if (!form.aplCase) {
          that.$message({ message: '请选择评估方案', type: 'warning' })
          return false
        }

        let ranges = []
        form.ranges.map(v => {
          ranges.push(...v.groupIds)
        })

        let postData = that.constructionMessage({
          type: '1196',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify({
            range: ranges.join(','),
            expirationDate: DateUtils.format_0800(form.deadline),
            modelId: form.aplCase.id
          }),
          content: form.name,
          isPrivate: '1',
          extension: form.aplCase.roleJson
        })

        this.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setStudentAppraisal({ form: null })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setStudentAppraisal({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .student-appraisal-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .sa-time input {
      min-width: initial !important;
    }
  }
</style>
