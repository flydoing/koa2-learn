<template>
  <page title="新建联考"
        closePrompt
        listenBack
        @back="back"
        :hasSubmit="isSwitched"
        @submit="handleSubmit">
    <div class="examination-box">
      <item label="各班级分别导入">
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
      <div class="category-title"></div>
      <template v-if="isSwitched">
        <item :hasClick="false"
              label="上传截止时间">

          <div slot="after">
            <el-date-picker v-model="endTime"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="必填"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"></el-date-picker>
          </div>
        </item>
        <div class="category-title"></div>
      </template>
      <item :hasClick="false">
        <div>考试名称</div>
        <input slot="remark"
               type="text"
               v-model="examinationName"
               placeholder="考试名称">
      </item>
      <item :hasClick="false">
        <div>考试时间</div>
        <div slot="after">
          <el-date-picker v-model="dateValue"
                          type="date"
                          placeholder="必填"
                          :clearable="false"
                          prefix-icon="xxx"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </item>
      <item @click="resultsShow">
        <div slot="main">成绩展示</div>
        <div slot="remark"
             v-html="showTxt"></div>
      </item>
      <template v-if="!isSwitched">
        <div class="category-title"></div>
        <item @click="inportTemplate">
          <div slot="main">导入文件</div>
          <div slot="remark"></div>
        </item>
      </template>
    </div>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G, MixinMessage],
    data() {
      return {
        dateValue: '',
        examinationName: '',
        showDatas: [],
        showDatasName: [],
        showDatasValue: [],
        isSeparate: '0',
        endTime: ''
      }
    },
    computed: {
      ...mapGetters({
        cacheInfo: 'getCreateInfo'
      }),
      isSwitched() {
        return this.isSeparate === '1'
      },
      showTxt() {
        if (Check.isRealArray(this.showDatas)) {
          return this.showDatas
            .map(v => {
              return v.name
            })
            .join('、')
        }
        return ''
      },
      showVal() {
        if (Check.isRealArray(this.showDatas)) {
          return this.showDatas
            .map(v => {
              return v.value
            })
            .join(',')
        }
        return ''
      }
    },
    activated() {
      // 拿到传过来的参数
      let datas = this.cacheInfo.datas
      if (Check.isRealArray(datas)) {
        this.showDatas = datas
        this.showDatasName = datas
        this.showDatasValue = datas
      }
    },
    methods: {
      ...mapActions(['saveCreateInfo', 'clearCreateInfo', 'modifyChannelMessage']),
      handleSwitch() {
        let value = this.isSeparate
        this.isSeparate = value === '1' ? '0' : '1'
      },
      inportTemplate() {
        if (!this.examinationName) {
          this.$message({
            type: 'warning',
            message: '联考名称不能为空'
          })
          return false
        }
        if (!this.dateValue) {
          this.$message({
            type: 'warning',
            message: '联考日期不能为空'
          })
          return false
        }
        this.$import({
          title: '导入成绩表',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/examTemplate.xlsx',
          callback: (res, file) => {
            Api.parseExcel({
              ...this.constructionMessage(),
              groupId: this.groupId,
              fileId: res.file.id,
              entranceExam: {
                examDate: this.dateValue,
                name: this.examinationName,
                displayOption: this.showVal
              }
            }).then(res => {
              if (res.commonTables) {
                this.setStorage('exam_import_data', res.commonTables)
                this.routePush({ name: 'errorView1123' })
              } else if (res.message) {
                this.$message({ type: 'success', message: '操作成功' })
                this.modifyChannelMessage(res.message)
                this.routeBack()
              }
            })
          }
        })
      },
      resultsShow() {
        // 成绩展示
        this.routePush({
          name: 'resultsShow1123'
        })
      },
      handleSubmit() {
        if (!this.endTime) {
          this.$message({
            type: 'warning',
            message: '上传截止不能为空'
          })
          return false
        }
        if (!this.examinationName) {
          this.$message({
            type: 'warning',
            message: '联考名称不能为空'
          })
          return false
        }
        if (!this.dateValue) {
          this.$message({
            type: 'warning',
            message: '联考日期不能为空'
          })
          return false
        }
        // 提交
        let examination = this.constructionMessage({
          groupId: this.groupId,
          entranceExam: {
            examDate: this.dateValue,
            name: this.examinationName,
            displayOption: this.showVal,
            isSeparate: this.isSeparate,
            importEndDate: DateUtils.format_0800(this.endTime)
          }
        })
        Api.parseExcel(examination).then(res => {
          this.modifyChannelMessage(res.message)
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearCreateInfo()
            this.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .examination-box {
    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    .el-time-panel__content {
      &::before {
        top: 54%;
      }
      &::after {
        top: 54%;
        left: 0;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-left: rem(0);
      padding-right: rem(0);
    }

    .el-time-panel__footer {
      padding-right: rem(15);
    }

    input {
      text-align: right !important;
      min-width: 276px !important;
    }
  }
</style>
