<template>
  <page title="新建成绩"
        closePrompt
        listenBack
        @back="back">
    <div slot="btn">
      <label @click="importResult">导入</label>
    </div>
    <div class="result-box">
      <item class="full-input"
            :hasClick="false">
        <input type="text"
               placeholder="考试名称"
               v-model="resultName">
      </item>
      <item :hasClick="false"
            class="full-input">
        <el-date-picker v-model="resultTimer"
                        type="date"
                        placeholder="考试时间"
                        :clearable="false"
                        prefix-icon="xxx"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </item>
      <item @click="switchHandle('showRanking')">
        <div>向学生家长显示排名</div>
        <div slot="remark">
          <i-switch :value="showRanking"
                    @click="switchHandle('showRanking')"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="switchHandle('showAverage')">
        <div>向学生家长显示平均分</div>
        <div slot="remark">
          <i-switch :value="showAverage"
                    @click="switchHandle('showAverage')"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item @click="switchHandle('showScore')">
        <div>向学生家长显示分数</div>
        <div slot="remark">
          <i-switch :value="showScore"
                    @click="switchHandle('showScore')"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item v-if="!showScore"
            @click="setGrade">
        <div>分数阶梯设置</div>
        <div slot="remark"
             class="ellipsis">{{gradeSetText}}</div>
      </item>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        resultName: '',
        resultTimer: '',
        showRanking: false,
        showAverage: false,
        showScore: false,
        gradeSetText: '必填'
      }
    },
    computed: {
      ...mapGetters({
        cacheInfo: 'getResultCreateInfo'
      })
    },
    activated() {
      if (this.cacheInfo.isEdit) {
        this.resetData()
      }
    },
    methods: {
      ...mapActions(['saveResultCreateInfo', 'clearResultInfo']),
      switchHandle(str) {
        this[str] = !this[str]
      },
      importResult() {
        if (!this.resultName) {
          this.$message({
            type: 'warning',
            message: '考试名称不能为空'
          })
          return false
        }
        if (!this.resultTimer) {
          this.$message({
            type: 'warning',
            message: '考试时间不能为空'
          })
          return false
        }
        if (!this.showScore && this.gradeSetText === '必填') {
          this.$message({
            type: 'warning',
            message: '分数阶梯设置不能为空'
          })
          return false
        }
        this.$import({
          title: '导入成绩单',
          uploadURI: this.uploadURL,
          templateUrl: `/business/reportcard/getReportCardTemplate/${this.currentGroup.groupId}`,
          callback: (res, file) => {
            Api.importResult(this.currentGroup.groupId, res.file.id).then(res => {
              if (res.code === '1') {
                let scoreLadder = {}
                this.cacheInfo.stairs.forEach(stair => {
                  stair.isSelect &&
                    stair.ladders.forEach((ladder, l) => {
                      if (l < stair.ladders.length - 1) {
                        scoreLadder[ladder.grade] = ladder.value
                      }
                    })
                })
                this.addMessage({
                  groupId: this.currentGroup.groupId,
                  type: '1003',
                  title: this.resultName,
                  msgJson: JSON.stringify({
                    avg: this.showAverage ? 1 : 0,
                    examDate: this.resultTimer,
                    groupId: this.currentGroup.groupId,
                    rankSwitch: this.showRanking ? 1 : 0,
                    reportCardName: this.resultName,
                    scoreLadder: scoreLadder,
                    showScore: this.showScore ? 1 : 0,
                    tableRows: [...res.dataGirds[0].data]
                  }),
                  ...this.constructionMessage()
                }).then(res => {
                  this.$message({
                    type: 'success',
                    message: '成功'
                  })
                  this.routeBack()
                  this.clearResultInfo()
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            })
          }
        })
      },
      setGrade() {
        this.saveResultCreateInfo({
          resultName: this.resultName,
          resultTimer: this.resultTimer,
          showRanking: this.showRanking,
          showAverage: this.showAverage,
          showScore: this.showScore,
          gradeSetText: this.gradeSetText,
          isEdit: true
        })
        this.routePush({
          name: 'scoreStairSetting1003'
        })
      },
      resetData() {
        this.resultName = this.cacheInfo.resultName
        this.resultTimer = this.cacheInfo.resultTimer
        this.showRanking = this.cacheInfo.showRanking
        this.showAverage = this.cacheInfo.showAverage
        this.showScore = this.cacheInfo.showScore
        this.gradeSetText = this.cacheInfo.gradeSetText
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.clearResultInfo()
            this.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .result-box {
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
  }
</style>
