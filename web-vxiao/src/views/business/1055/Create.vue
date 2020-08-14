<template>
  <Page title="新建报名"
        closePrompt>
    <div slot="main"
         id="apply-create"
         v-loading.fullscreen.lock="loading"
         element-loading-text="提交中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)">
      <item :hasClick="false">
        <div>标题</div>
        <input slot="remark"
               type="text"
               placeholder="标题"
               v-model="title">
      </item>
      <item :hasClick="false">
        <div>截止时间</div>
        <div slot="remark">
          <el-date-picker v-model="setTime"
                          :clearable="false"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm:ss.0 +0800"
                          prefix-icon="xxx"
                          placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </item>
      <item @click="handleAudit">
        <div slot="main">是否需要审核</div>
        <div slot="after">
          <i-switch :value="question.isAudit"
                    :trueValue="1"
                    :falseValue="0"
                    @click="handleAudit"></i-switch>
        </div>
      </item>
      <item @click="enrolmentInfoHandle">
        <div slot="main">报名人信息</div>
        <div slot="remark">
          <template v-if="question.enrollTable.metaDatas.length>0">{{question.enrollTable.metaDatas.length}}项</template>
        </div>
      </item>
      <item @click="selectPraxisStyle">
        <div slot="main">须回答内容</div>
        <div slot="remark">
          <template v-if="question.enrollTable.questionnaire.questions.length>0">{{question.enrollTable.questionnaire.questions.length}} 题</template>
        </div>
      </item>
      <item @click="visibleRangeHandle">
        <div slot="main">可见范围</div>
        <div slot="remark">{{rangeText}}</div>
      </item>
      <div class="edit-box">
        <ueSimple id="create-editor"
                  placeholder="简介"
                  :tools="['pic', 'file']"
                  v-model="briefContent"
                  @getMedias="fromSimpleImage"
                  :medias="enroll.medias"></ueSimple>
      </div>
      <div class="commin-btn">
        <button @click="handleSubmit">发布报名</button>
      </div>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Str from '@/utils/string'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      ueSimple: resolve => require(['./SimpleEditor'], resolve),
      ReplyContent: resolve => require(['./ReplyContent'], resolve)
    },
    computed: {
      ...mapGetters({
        enroll: 'getEnroll',
        question: 'getQuestion'
      }),
      title: {
        get() {
          return this.enroll.title
        },
        set(value) {
          this.saveEnroll({
            title: value
          })
        }
      },
      setTime: {
        get() {
          return this.enroll.times[0].setTime
        },
        set(value) {
          this.saveEnroll({
            times: [
              {
                type: 'end',
                setTime: value
              }
            ]
          })
        }
      },
      briefContent: {
        get() {
          return this.enroll.content
        },
        set(value) {
          this.saveEnroll({
            content: value
          })
        }
      },
      rangeText() {
        if (Check.isRealArray(this.enroll.toUsers)) {
          return `${this.enroll.toUsers[0].name}等${this.enroll.toUsers.length}个`
        }
        return '全体成员'
      }
    },
    data() {
      return {
        loading: false,
        isSchoolBol: this.routeQuery('isSchool') ? this.routeQuery('isSchool') : false
        // visibleGroups: [],
        // visibleMembers: []
      }
    },
    created() {
      // 设置请求头
      if (this.routeQuery('tokenId') || this.$route.query.hasOwnProperty('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId') || this.$route.query.token
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId') || this.$route.query.clientId
      }
      // if (this.routeQuery('isSchool')) {
      //   this.visibleGroups = [...this.enroll.visibleRange]
      // } else {
      //   this.visibleMembers = [...this.enroll.visibleRange]
      // }
    },
    methods: {
      ...mapActions(['saveEnroll', 'saveQuestion']),
      handleSubmit() {
        if (Check.isNullString(this.enroll.title)) {
          this.$message({
            message: '标题不能为空',
            type: 'warning'
          })
          return false
        }
        if (Check.isNullString(this.enroll.times[0].setTime)) {
          this.$message({
            message: '截止日期不能为空',
            type: 'warning'
          })
          return false
        }
        if (Check.isNullString(this.enroll.content)) {
          this.$message({
            message: '简介不能为空',
            type: 'warning'
          })
          return false
        }
        this.loading = true
        // let allowGroup = []
        // this.visibleGroups.forEach(g => {
        //   allowGroup.push({
        //     groupId: g.groupId,
        //     name: g.name,
        //     type: 'cc',
        //     userId: g.id,
        //     userType: 'group'
        //   })
        // })
        // let visibleUsers = []
        // this.visibleMembers.forEach(u => {
        //   visibleUsers.push({
        //     avatar: u.avatar,
        //     groupId: u.groupId,
        //     name: u.name,
        //     status: u.status,
        //     type: 'cc',
        //     userId: u.userId,
        //     userType: u.userType
        //   })
        // })
        // const visibleRange = this.routeQuery('isSchool') ? allowGroup : visibleUsers
        // var rqeBody = {
        //   fromClientId: this.$route.query.clientId,
        //   fromUserId: this.$route.query.userId,
        //   groupId: this.$route.query.groupId,
        //   refId: Str.uuid(),
        //   title: this.titleCode,
        //   content: this.inputStr,
        //   type: '1055',
        //   toUsers: visibleRange,
        //   times: [{
        //     type: 'end',
        //     setTime: DateUtils.format_0800(this.timerValue)
        //   }],
        //   msgJson: JSON.stringify({
        //     isAudit: this.enroll.switchValue ? 1 : 0,
        //     enrollTable: {
        //       metaDatas: this.enroll.enrolmentInfo,
        //       questionnaire: {
        //         questions: this.praxisData
        //       }
        //     }
        //   }),
        //   medias: this.enroll.breifImg.concat(this.enroll.breifFile)
        // }
        Api.create({
          msgJson: JSON.stringify(this.question),
          ...this.enroll,
          ...{
            fromClientId: this.$route.query.clientId,
            fromUserId: this.$route.query.userId,
            groupId: this.$route.query.groupId,
            refId: Str.uuid(),
            type: '1055'
          }
        }).then(res => {
          this.loading = false
          if (res.code === '1') {
            this.$web.postJsAction({
              type: 'createComplete',
              message: res.messages[0]
            })
          }
        })
      },
      selectPraxisStyle() {
        this.routePush({
          name: 'applyReplyContent',
          query: {
            schoolId: this.routeQuery('schoolId')
          }
        })
      },
      fromSimpleImage(objs) {
        this.saveEnroll({
          medias: objs.medias
        })
      },
      callbackState() {
        // this.praxisData = this.getStorage('praxis', true) || []
      },
      enrolmentInfoHandle() {
        this.routePush({
          name: 'applyenrolmentInfo1055',
          query: {
            schoolId: this.routeQuery('schoolId')
          }
        })
      },
      visibleRangeHandle() {
        this.routePush({
          name: 'applyVisibleRange1055',
          query: {
            isSchool: this.isSchoolBol,
            clientId: this.routeQuery('clientId'),
            token: this.routeQuery('token'),
            groupId: this.routeQuery('groupId')
          }
        })
      },
      handleAudit() {
        this.saveQuestion({
          isAudit: this.question.isAudit === 0 ? 1 : 0
        })
      }
    }
  }
</script>
<style lang="scss">
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
    padding-left: rem(8);
    padding-right: rem(8);
  }

  .el-time-panel__footer {
    padding-right: rem(15);
  }

  .commin-btn {
    button {
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      @include bch;
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bc;
      }
    }
  }

  .text-area {
    display: block;
    width: 100%;
    padding: rem(10);
    height: rem(200);
    font-size: rem(14);
    border: 0;
    margin: 0 auto rem(10);
  }
</style>
