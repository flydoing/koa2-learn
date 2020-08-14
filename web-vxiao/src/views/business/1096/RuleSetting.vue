<template>
  <page title="新建选拔"
        closePrompt>
    <label slot="btn"
           @click="handleSubmit">发布</label>
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>面向年级</span>
        <span><b>2</b><br>备选课程</span>
        <span><b>3</b><br>选课数量</span>
        <span class="active"><b>4</b><br>规则设定</span>
        <i></i>
      </div>
    </div>
    <div class="rule-setting">
      <item :hasClick="false">
        <div slot="main">选拔名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="输入名称（如：2017年高三选拔）"
               v-model="form.name" />
      </item>
      <item @click="showSelectTime = true">
        <div slot="main">选拔时间</div>
        <div slot="remark"
             v-html="timeTxt"></div>
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleWay">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">录取方式</div>
            <div slot="remark"
                 v-html="wayTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(way,i) in ways"
                            :key="i"
                            :way="way"
                            :command="way">{{way.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item :hasClick="false"
            v-if="form.way && form.way.value==='2'">
        <div slot="main">志愿数量</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.count" />
      </item>
      <item @click="handleImportRestrict">
        <div slot="main">导入不参与选拔的学生名单</div>
        <div slot="remark"
             v-html="restrictFileName"></div>
      </item>
      <item @click="handleImportEnroll">
        <div slot="main">导入预录取的学生名单</div>
        <div slot="remark"
             v-html="enrollFileName"></div>
      </item>
    </div>
    <SelectTime :startTime="form.startTime"
                :endTime="form.endTime"
                :show.sync="showSelectTime"
                @confirm="handleTimeConfirm"></SelectTime>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectTime: resolve => require(['./SelectDateTime'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          startTime: '',
          endTime: '',
          way: null,
          count: '',
          restrictFile: null,
          enrollFile: null
        },
        ways: [],
        showSelectTime: false
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
        if (!Check.isNullString(this.form.startTime) && !Check.isNullString(this.form.endTime)) {
          let sTime = DateUtils.format(this.form.startTime, DateUtils.MDHM)
          let eTime = DateUtils.format(this.form.endTime, DateUtils.MDHM)
          return `${sTime} 至 ${eTime}`
        }
        return ''
      },
      wayTxt() {
        return this.form.way ? this.form.way.name : ''
      },
      restrictFileName() {
        return this.form.restrictFile ? this.form.restrictFile.name : ''
      },
      enrollFileName() {
        return this.form.enrollFile ? this.form.enrollFile.name : ''
      }
    },
    methods: {
      ...mapActions(['setSelection', 'modifyChannelMessage']),
      fileName(file) {
        return file ? file.name : '点击导入'
      },
      fetchData() {
        if (this.selection.ruleForm) {
          this.form = JSON.parse(JSON.stringify(this.selection.ruleForm))
        }
        CategoryApi.getCategorysByType('97').then(res => {
          this.ways = res.categorys
        })
      },
      handleWay(item) {
        this.form.way = item
      },
      handleImportRestrict() {
        const that = this
        let version = that.selection.version
        let schoolId = that.currentGroup.parentId
        that.$import({
          title: '导入不参与选课的学生',
          uploadURI: this.uploadURL,
          templateUrl: `/static/templates/studentBanList.xlsx`,
          callback: (res, file) => {
            let fileId = res.file.id
            this.form.restrictFile = res.file
            Api.importRestrictStudents({
              schoolId: schoolId,
              fileId: fileId,
              version: version
            })
              .then(result => {
                that.$message({ type: 'success', message: '操作成功' })
              })
              .catch(result => {
                if (result.commonTable) {
                  let tbl = result.commonTable
                  tbl.datas.splice(0, 1)
                  that.setStorage('_import_receipt', { lines: tbl.datas, headers: tbl.titles })
                  let urlSrc = '/business/optioncourse/import/restrict'
                  that.setSelection({ ruleForm: that.form })
                  that.routePush({
                    path: '/vx/group/import/receipt',
                    query: {
                      uri: `${urlSrc}?schoolId=${schoolId}&version=${version}`,
                      fileId: fileId
                    }
                  })
                }
              })
          }
        })
      },
      handleImportEnroll() {
        const that = this
        let version = that.selection.version
        let schoolId = that.currentGroup.parentId
        that.$import({
          title: '导入预录取的学生名单',
          uploadURI: this.uploadURL,
          templateUrl: `/static/templates/defaultJoiner.xlsx`,
          callback: (res, file) => {
            let fileId = res.file.id
            this.form.enrollFile = res.file
            Api.importEnrollStudents({
              schoolId: schoolId,
              fileId: fileId,
              version: version
            })
              .then(result => {
                that.$message({ type: 'success', message: '操作成功' })
              })
              .catch(result => {
                if (result.commonTable) {
                  let tbl = result.commonTable
                  tbl.datas.splice(0, 1)
                  that.setStorage('_import_receipt', { lines: tbl.datas, headers: tbl.titles })
                  let urlSrc = '/business/optioncourse/import/default/joiner'
                  that.setSelection({ ruleForm: that.form })
                  that.routePush({
                    path: '/vx/group/import/receipt',
                    query: {
                      uri: `${urlSrc}?schoolId=${schoolId}&version=${version}`,
                      fileId: fileId
                    }
                  })
                }
              })
          }
        })
      },
      handleTimeConfirm(times) {
        this.form.startTime = times[0]
        this.form.endTime = times[1]
        this.showSelectTime = false
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.name)) {
          this.$message({ type: 'warning', message: '选拔名称不能为空' })
          return false
        }
        if (Check.isNullString(form.startTime) || Check.isNullString(form.endTime)) {
          this.$message({ type: 'warning', message: '请选择选拔时间' })
          return false
        }
        if (!form.way) {
          this.$message({ type: 'warning', message: '请选择录取方式' })
          return false
        }
        let amountForm = that.selection.amountForm
        let date = new Date()
        let postData = {
          schoolId: that.currentGroup.parentId,
          publish: {
            name: form.name,
            startTime: DateUtils.format_0800(`${date.getFullYear()}-${form.startTime}`),
            endTime: DateUtils.format_0800(`${date.getFullYear()}-${form.endTime}`),
            count: amountForm.courseCount,
            requiredCount: amountForm.mCount,
            categoryName: form.way.name,
            categoryId: form.way.id,
            categoryValue: form.way.value,
            grades: that.selection.grades.map(v => {
              return { groupId: v.groupId }
            })
          },
          version: that.selection.version
        }
        if (form.way.value === '2') {
          postData.publish.voluntaryCount = form.count
        }
        if (form.enrollFile) {
          postData.publish.defaultJoinerFileId = form.enrollFile.id
        }
        if (form.restrictFile) {
          postData.publish.restrictFileId = form.restrictFile.id
        }
        Api.saveSelection(postData).then(res => {
          if (res.message) {
            that.modifyChannelMessage(res.message)
          }
          that.$message({ type: 'success', message: '操作成功' })
          that.$router.go(-5)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;
    border-bottom: $border;

    .step-content {
      margin: 0 auto;
      display: inline-block;
      position: relative;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 100%;
        left: 0;
      }

      span {
        display: inline-block;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;

        b {
          font-weight: normal;
          margin-right: rem(5);
          border-radius: rem(18);
          width: rem(18);
          height: rem(18);
          line-height: rem(18);
          text-align: center;
          border: $border2;
          display: inline-block;
          margin-bottom: rem(3);
        }

        &.active {
          @include fc;
        }

        &.active b {
          @include borderColor;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
</style>
