<template>
  <page title="报名"
        :titleBorder="false"
        v-loading.fullscreen.lock="loadingBol"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)">

    <div v-if="!isShowVcode">
      <template v-if="auditTxt">
        <div class="approve-result">
          <div :class="auditClass"
               v-html="auditTxt"></div>
          <div v-html="auditRemark"></div>
        </div>
        <div class="category-title"></div>
      </template>
      <div class="applycan-detail">
        <div class="base-info-list">
          <template v-if="personalInfo.enrollTable.metaDatas.length > 0">
            <div v-for="(info, i) in personalInfo.enrollTable.metaDatas"
                 :key="i">
              <div class="base-info-item"
                   v-if="info.extension==='avatar'">
                <item :label="info.key"
                      :hasClick="status===3">
                  <template v-if="status===1 || status === 3">
                    <el-upload slot="remark"
                               :action="uploadURL"
                               :show-file-list="false"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                      <img class="avatar big"
                           v-lazy="{src:url(info.obj ? JSON.parse(info.obj)[0] : '', 'thumb'),error:Image.ICO_AVATAR}"
                           alt='avatar' />
                    </el-upload>
                  </template>
                  <template v-else>
                    <img slot="remark"
                         class="avatar big"
                         v-lazy="{src:url(info.obj ? JSON.parse(info.obj)[0] : '', 'thumb'),error:Image.ICO_AVATAR}"
                         alt='avatar' />
                  </template>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension.type==='imageArea'">
                <item @click="addImage(info, i)"
                      :label="info.key">
                  <div slot="remark"
                       class="image-block">
                    <div class="pic-list"
                         v-if="info.obj">
                      <template v-for="(obj, o) in JSON.parse(info.obj)">
                        <img class="pic"
                             v-lazy="{src:url(obj.fileId, 'thumb')}"
                             :key="o"
                             v-if="o < 3"
                             alt="pic">
                      </template>
                    </div>
                    <span v-else>{{info.extension.required === '1'?'上传图片（必选）':'上传图片（选填）'}}</span>
                  </div>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension==='gender'">
                <item :hasClick="false"
                      :label="info.key">
                  <template slot="remark"
                            v-if="status===0 || status===2 || status===4 || status===5">{{info.obj ? info.obj : ''}}</template>
                  <template slot="remark"
                            v-else>
                    <el-radio-group v-model="info.obj">
                      <el-radio label="男">男</el-radio>
                      <el-radio label="女">女</el-radio>
                    </el-radio-group>
                  </template>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension ==='date'">
                <item :hasClick="false"
                      :label="info.key">
                  <div slot="remark">
                    <template v-if="status===1 || status===3">
                      <el-date-picker v-model="dateValue"
                                      :clearable="false"
                                      type="date"
                                      format="yyyy-MM-dd"
                                      value-format="yyyy-MM-dd"
                                      prefix-icon="xxx"
                                      placeholder="选择日期时间">
                      </el-date-picker>
                    </template>
                    <template v-else>
                      {{info.obj ? info.obj : ''}}
                    </template>
                  </div>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension.type==='date'">
                <item :hasClick="false"
                      :label="info.key">
                  <div slot="remark">
                    <template v-if="status===1 || status===3">
                      <el-date-picker v-model="dateValue1"
                                      :clearable="false"
                                      type="date"
                                      format="yyyy-MM-dd"
                                      value-format="yyyy-MM-dd"
                                      prefix-icon="xxx"
                                      placeholder="选择日期时间">
                      </el-date-picker>
                    </template>
                    <template v-else>
                      {{info.obj ? info.obj : ''}}
                    </template>
                  </div>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension==='mobile'">
                <item :hasClick="false"
                      :label="info.key">
                  <template slot="remark"
                            v-if="status===0 || status===2 || status===4 || status===5">
                    <span>{{info.obj ? info.obj : ''}}</span>
                  </template>
                  <template slot="remark"
                            v-else>
                    <input type="text"
                           placeholder="必填"
                           :value="info.obj"
                           @input="changeContenHandle($event, info, i)">
                  </template>
                </item>
                <item :hasClick="false"
                      v-if="status===1 || status===3">
                  <div slot="before">
                    <input type="text"
                           class="code-input"
                           placeholder="输入验证码"
                           v-model="code">
                  </div>
                  <div slot="remark"
                       :class="codeClass"
                       @click="handleCode(info.obj)"
                       v-html="codeTxt"></div>
                </item>
              </div>
              <div class="base-info-item"
                   v-else-if="info.extension==='name'">
                <item :hasClick="false"
                      :label="info.key">
                  <template slot="remark"
                            v-if="status===0 || status===2 || status===4 || status===5">
                    <span>{{info.obj ? info.obj : ''}}</span>
                  </template>
                  <template slot="remark"
                            v-else>
                    <input type="text"
                           placeholder="必填"
                           :value="info.obj"
                           @input="changeContenHandle($event, info, i)">
                  </template>
                </item>
              </div>
              <div class="base-info-item"
                   v-else>
                <item :hasClick="false"
                      :label="info.key">
                  <template slot="remark"
                            v-if="status===0 || status===2 || status===4 || status===5">
                    <span>{{info.obj ? info.obj : ''}}</span>
                  </template>
                  <template slot="remark"
                            v-else>
                    <input type="text"
                           :placeholder="info.extension.required === '1'?'必填':'选填'"
                           :value="info.obj"
                           @input="changeContenHandle($event, info, i)">
                  </template>
                </item>
              </div>
            </div>
          </template>
        </div>
      </div>
      <Praxis :questions="personalInfo.enrollTable.questionnaire.questions"
              :status="status"
              v-if="personalInfo.enrollTable.questionnaire.questions.length>0"></Praxis>
      <div class="commin-btn"
           v-if="status!==2">
        <button @click="handleSure(status) ">{{btnText}}</button>
      </div>
    </div>
    <div class="vcode-status"
         v-if="isShowVcode">{{isShowVcodeMsg}}</div>
  </page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Praxis: resolve => require(['./PraxisList'], resolve)
    },
    data() {
      return {
        loadingBol: false,
        id: null,
        questionnaireId: null,
        metaDatas: [],
        questions: [],
        participant: {},
        // status---> 0 等待，1 不同意， 2 同意，3 未报名, 4 创建者自己查看 , 5 已审批过
        status: null,
        serialNumber: '',
        // true --> 创建者
        flag: false,
        code: '',
        second: 60,
        disabled: false,
        isShowVcode: false,
        isShowVcodeMsg: '',
        changeStatus: false,
        tempArr: []
      }
    },
    computed: {
      ...mapGetters({
        personalInfo: 'getPersonalInfo',
        applycanId: 'getApplycanId'
      }),
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      },
      codeTxt() {
        return this.disabled ? `已获取（${this.second}s）` : '获取验证码'
      },
      auditTxt() {
        let participant = this.participant || {}
        if (participant.auditType) {
          return participant.auditType === 1 ? '审核不通过' : '审核通过'
        }
        return ''
      },
      codeClass() {
        return {
          'text-color': true,
          disabled: this.disabled
        }
      },
      auditClass() {
        let participant = this.participant || {}
        if (participant.auditType === 1) {
          return {
            'text-color': true,
            error: true
          }
        }
        return ''
      },
      auditRemark() {
        let participant = this.participant || {}
        let txt = participant.auditType === 1 ? '不通过原因' : '通过原因'
        return participant.describe ? `${txt}：${participant.describe}` : ''
      },
      btnText() {
        switch (this.status) {
          case 0:
            return '取消报名'
          case 1:
            return '重新提交'
          case 2:
            return '审核通过'
          case 3:
            return '提交报名信息'
          case 4:
            return '审核'
          case 5:
            return '重新审核'
        }
      },
      dateValue: {
        get() {
          let metaDatas = [...this.personalInfo.enrollTable.metaDatas]
          let infoObj = metaDatas.filter(m => {
            return m.extension === 'date'
          })
          return infoObj[0].obj
        },
        set(value) {
          let metaDatas = [...this.personalInfo.enrollTable.metaDatas]
          let index = null
          const that = this
          metaDatas.filter((m, i) => {
            if (m.extension === 'date') {
              index = i
            }
          })
          metaDatas[index].obj = value
          this.savePersonalInfo({
            enrollTable: {
              ...that.personalInfo.enrollTable,
              metaDatas: metaDatas
            }
          })
        }
      },
      dateValue1: {
        get() {
          let metaDatas = [...this.personalInfo.enrollTable.metaDatas]
          let infoObj = metaDatas.filter(m => {
            return m.extension.type === 'date'
          })
          return infoObj[0].obj
        },
        set(value) {
          let metaDatas = [...this.personalInfo.enrollTable.metaDatas]
          let index = null
          const that = this
          metaDatas.filter((m, i) => {
            if (m.extension.type === 'date') {
              index = i
            }
          })
          metaDatas[index].obj = value
          this.savePersonalInfo({
            enrollTable: {
              ...that.personalInfo.enrollTable,
              metaDatas: metaDatas
            }
          })
        }
      }
    },
    activated() {
      document.title = '报名'
      if (this.routeQuery('tokenId') || this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId') || this.routeQuery('token')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      if (this.routeQuery('serialNumber')) {
        this.changeStatus = false
      }
      this.routeQuery('msgId') &&
        Api.queryTable(
          this.routeQuery('msgId'),
          this.routeQuery('userId') || null,
          this.routeQuery('mobile') || null,
          this.routeQuery('vcode') || null,
          this.routeQuery('serialNumber') || null,
          this.routeQuery('name') || null
        )
          .then(res => {
            if (res.code === '1') {
              this.isShowVcode = false
              this.id = res.enroll.id
              this.questionnaireId = res.enroll.enrollTable.hasOwnProperty('questionnaire') ? res.enroll.enrollTable.questionnaire.id : null
              if (this.changeStatus) {
                this.metaDatas = [...this.personalInfo.enrollTable.metaDatas]
                // this.questions = [...this.personalInfo.enrollTable.questionnaire.questions]
                if (this.personalInfo.enrollTable.questionnaire) {
                  this.questions = [...this.personalInfo.enrollTable.questionnaire.questions]
                }
              } else {
                // this.questions = res.enroll.enrollTable.questionnaire.questions ? res.enroll.enrollTable.questionnaire.questions : []
                if (res.enroll.enrollTable.questionnaire) {
                  this.questions = res.enroll.enrollTable.questionnaire.questions ? res.enroll.enrollTable.questionnaire.questions : []
                }
                this.metaDatas = res.enroll.enrollTable.metaDatas.map(v => {
                  // if (v.extension === 'select') {
                  //   v.obj = v.obj || '男'
                  // }
                  // return v
                  if (v.extension && this.isJSON(v.extension)) {
                    v.extension = JSON.parse(v.extension)
                    let arr = []
                    if (v.extension.options && v.extension.options.length > 0) {
                      if (v.extension.type === 'select') {
                        arr.push({
                          title: v.key,
                          options: v.extension.options,
                          type: '1'
                        })
                      } else if (v.extension.type === 'multi_select') {
                        arr.push({
                          title: v.key,
                          options: v.extension.options,
                          type: '2'
                        })
                      }
                      this.tempArr.push(v)
                      this.questions = this.questions.concat(arr)
                    }
                  }
                  return v
                })
                this.metaDatas = this.metaDatas.filter(item => {
                  if (item.extension.options && item.extension.options.length > 0) {
                    return false
                  } else {
                    return true
                  }
                })
                this.savePersonalInfo({
                  enrollTable: {
                    ...this.personalInfo.enrollTable,
                    metaDatas: this.metaDatas,
                    questionnaire: {
                      id: this.questionnaireId,
                      questions: this.questions || []
                    }
                  }
                })
                // this.savePersonalInfo({
                //   enrollTable: {
                //     ...this.personalInfo.enrollTable,

                //   }
                // })
              }
              this.changeStatus = true
              // this.saveApplycanId(res.enroll.fromClientId)
              this.participant = res.enroll.participant ? res.enroll.participant : {}
              this.flag = res.enroll.flag ? res.enroll.flag : false
              if (res.enroll.hasOwnProperty('fromClientId')) {
                this.serialNumber = res.enroll.fromClientId
              }
              if (this.flag) {
                this.status = 4
                if (this.participant && (this.participant.auditType === 1 || this.participant.auditType === 2)) {
                  this.status = 5
                }
              } else {
                if (Check.isNullObject(this.participant)) {
                  this.status = 3
                } else {
                  this.status = parseInt(this.participant.auditType)
                }
              }
            } else if (res.code === '22') {
              this.isShowVcode = true
              this.isShowVcodeMsg = '验证码错误，请返回上一级重新查询'
            } else if (res.code === '10') {
              this.isShowVcode = true
            }
          })
          .catch(res => {
            console.log(res)
            if (res.code === '22') {
              this.isShowVcode = true
              this.isShowVcodeMsg = '验证码错误，请返回上一级重新查询'
            } else if (res.code === '10') {
              this.isShowVcode = true
              this.isShowVcodeMsg = '姓名错误，请返回上一级重新查询'
            } else {
              this.isShowVcode = true
              this.isShowVcodeMsg = res.msg
            }
          })
    },
    created() {},
    methods: {
      ...mapActions(['savePersonalInfo', 'saveCacheData', 'saveApplycanId', 'modifyChannelMessage']),
      isJSON(str) {
        if (typeof str === 'string') {
          try {
            if (str.indexOf('{') > -1) {
              return true
            } else {
              return false
            }
          } catch (e) {
            console.log(e)
            return false
          }
        }
        return false
      },
      handleCode(mobile) {
        if (!this.disabled) {
          let timer = setInterval(() => {
            if (this.second === 0) {
              clearInterval(timer)
              this.disabled = false
              this.second = 60
            }
            this.second = this.second - 1
          }, 1000)
          if (!mobile) {
            this.$message({ type: 'warning', message: `请输入手机号码` })
            return false
          }
          if (!/^1[34578]\d{9}$/.test(mobile)) {
            this.$message({ type: 'warning', message: `手机号码格式不正确` })
            return false
          }
          Api.getCode(mobile).then(res => {})
          this.disabled = true
        }
      },
      handleSure(i) {
        let that = this
        let vxCode = this.routeQuery('code') || ''
        let state = this.routeQuery('state')
        let fromPapers = this.routeQuery('fromPapers')
        let vxAppId = this.routeQuery('weixinAppId') || ''

        if (i === 3 || i === 1) {
          if (Check.isNullString(this.code)) {
            this.$message({ type: 'warning', message: `请输入验证码` })
            return false
          }
          let key = ''
          let isNull = this.personalInfo.enrollTable.metaDatas.some(m => {
            key = m.key
            if (m.extension && m.extension.required === '0') {
              return false
            } else {
              return (
                !m.hasOwnProperty('obj') ||
                (m.extension === 'imageArea' && m.obj && JSON.parse(m.obj).length === 0) ||
                (m.obj && Check.isNullString(m.obj))
              )
            }
          })
          if (isNull) {
            this.$message({
              type: 'warning',
              message: `${key}不能为空！`
            })
            return false
          }

          let flag = true
          let Qestions = []
          if (this.personalInfo.enrollTable.questionnaire.questions.length > 0) {
            Qestions = JSON.parse(JSON.stringify(this.personalInfo.enrollTable.questionnaire.questions))
            Qestions.forEach(q => {
              if (flag && (q.type === '1' || q.type === '2')) {
                q.options = q.options.filter(o => {
                  return o.selected
                })
                if (q.isMandatory && q.options.length < 1) {
                  flag = false
                }
              }
            })
          }

          if (!flag) {
            this.$message({
              type: 'warning',
              message: `请填写必填题目`
            })
            return false
          }
          let arr = JSON.parse(JSON.stringify(this.metaDatas))
          arr = arr.map(item => {
            if (item.extension && item.extension.type) {
              item.extension = JSON.stringify(item.extension)
            }
            return item
          })
          let arr1 = Qestions.filter(item => {
            if (!item.id) {
              return true
            }
          })
          let questions = Qestions.filter(item => {
            if (item.id) {
              return true
            }
          })
          for (let i = 0; i < arr1.length; i++) {
            this.tempArr[i].extension.options = arr1[i].options
          }
          this.tempArr.forEach(item => {
            if (item.extension) {
              item.extension = JSON.stringify(item.extension)
            }
            return item
          })
          arr = arr.concat(this.tempArr)
          let reqBody = {}
          if (i === 3) {
            reqBody = {
              id: this.id,
              fromClientId: this.serialNumber,
              fromUserId: this.routeQuery('userId'),
              enrollTable: {
                metaDatas: arr,
                questionnaire: {
                  ...this.personalInfo.enrollTable.questionnaire,
                  questions: questions
                }
                // ...this.personalInfo.enrollTable,
                // questionnaire: {
                //   ...this.personalInfo.enrollTable.questionnaire,
                //   questions: Qestions
                // }
              }
            }
          } else {
            reqBody = {
              id: this.id,
              fromClientId: this.serialNumber,
              fromUserId: this.routeQuery('userId'),
              enrollTable: {
                metaDatas: arr
                // metaDatas: [...this.personalInfo.enrollTable.metaDatas]
              }
            }
          }
          // if (!this.routeQuery('token')) {
          //   // 第三方申请报名
          //   this.loadingBol = false
          //   // this.setStorage('reqTable', reqBody)
          //   this.saveCacheData(reqBody)
          //   this.routePush({
          //     name: 'applyVerificationCode',
          //     query: {
          //       serialNumber: this.serialNumber,
          //       msgId: this.routeQuery('msgId')
          //     }
          //   })
          //   return false
          // }
          this.loadingBol = true
          Api.commitTable({
            enroll: reqBody,
            vcode: this.code,
            code: vxCode,
            weixinAppId: state ? 'wx58a571e1551aa20c' : vxAppId
          })
            .then(res => {
              this.loadingBol = false
              if (res && res.code === '1') {
                this.$web.postJsAction({
                  // 客户端交互
                  type: 'activityEnroll',
                  msgId: this.routeQuery('msgId')
                })
                if (!this.isWeb || fromPapers || state) {
                  this.routePush({ name: 'result1055' })
                } else {
                  Api.loadOnceMessage(this.routeQuery('msgId')).then(res => {
                    if (res && res.code === '1') {
                      this.$web.postJsAction({
                        type: 'createComplete',
                        message: res.message
                      })
                      that.modifyChannelMessage(res.message)
                      this.routeBack()
                    }
                  })
                }
              }
            })
            .catch(() => {
              this.tempArr.forEach(item => {
                if (item.extension) {
                  item.extension = JSON.parse(item.extension)
                }
                return item
              })
              this.loadingBol = false
            })
        } else if (i === 4 || i === 5) {
          this.routePush({
            name: 'applyAudit',
            query: {
              key: this.routeQuery('serialNumber') || this.serialNumber,
              msgId: this.routeQuery('msgId'),
              token: this.routeQuery('token')
            }
          })
        } else if (i === 0) {
          // 取消报名
          this.loadingBol = true
          let req = {
            id: this.id,
            fromClientId: this.serialNumber || this.routeQuery('serialNumber'),
            fromUserId: this.routeQuery('userId'),
            status: 'd'
          }
          Api.commitTable({
            enroll: req
          })
            .then(res => {
              this.loadingBol = false
              if (res && res.code === '1') {
                Api.loadOnceMessage(this.routeQuery('msgId')).then(res => {
                  if (res && res.code === '1') {
                    this.$web.postJsAction({
                      type: 'cancelEnroll',
                      message: res.message
                    })
                    this.$web.postJsAction({
                      type: 'createComplete',
                      message: res.message
                    })
                    that.modifyChannelMessage(res.message)
                    this.routeBack()
                  }
                })
              }
            })
            .catch(() => {
              this.loadingBol = false
            })
        }
      },
      addImage(info, i) {
        if ((this.status === 0 && !this.flag) || this.status === 2) return false
        if (this.routeQuery('serialNumber')) return
        let cache = []
        if (info.hasOwnProperty('obj')) {
          let imgs = JSON.parse(info.obj)
          imgs.forEach(img => {
            img.url = this.url(img.fileId, 'thumb')
          })
          cache = [...imgs]
        }
        this.routePush({
          name: 'applyAddImage',
          query: {
            index: i,
            cacheList: Check.isNullArray(cache) ? void 0 : cache,
            isCreator: this.flag ? this.flag : void 0,
            msgId: this.routeQuery('msgId')
          }
        })
      },
      open(str) {
        this.$alert(str, '不同意理由', {
          confirmButtonText: '确定',
          center: true
        })
      },
      handleAvatarSuccess(res, file, fileLlist) {
        let that = this
        let fileId = res.file.id
        let index = null
        let metaDatas = [...that.personalInfo.enrollTable.metaDatas]
        // let metaDatas = JSON.parse(JSON.stringify(that.metaDatas))
        metaDatas.forEach((info, i) => {
          if (info.extension === 'avatar') {
            index = i
          }
        })
        metaDatas[index].obj = JSON.stringify([fileId])
        that.savePersonalInfo({
          enrollTable: {
            ...that.personalInfo.enrollTable,
            metaDatas: metaDatas
          }
        })
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      changeContenHandle(event, info, i) {
        let infoObj = [...this.personalInfo.enrollTable.metaDatas]
        infoObj[i].obj && delete infoObj[i].obj
        infoObj[i].obj = event.target.value
        this.savePersonalInfo({
          enrollTable: {
            ...this.personalInfo.enrollTable,
            metaDatas: infoObj
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .applycan-detail {
    width: 100%;
    overflow: hidden;
  }
  .text-color.disabled {
    color: #999;
  }
  .code-input {
    padding-left: 0 !important;
  }

  .el-message-box {
    width: 80% !important;
    max-width: rem(300) !important;
  }

  .vx-item {
    input {
      /* max-width: 70%; */
      min-width: rem(200) !important;
    }
  }

  .vx-item-right {
    padding-right: rem(8);
  }

  .image-block {
    .pic-list {
      @include flex;
      @include jc;
      @include ai;
      .pic {
        margin: 0 rem(5) 0 0;
        width: rem(60);
        height: rem(40);
      }
    }
  }

  .fs14 {
    font-size: rem(14);
  }

  .commin-btn {
    @include flex;
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
    padding-right: rem(0);
  }

  .el-time-panel__footer {
    padding-right: rem(15);
  }
  .approve-result {
    padding: rem(5) rem(10);
    text-align: justify;
  }
  .vcode-status {
    margin-top: 50px;
    text-align: center;
  }
</style>
