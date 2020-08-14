<template>
  <div class='sign-page'>
    <div v-if="allowNonuser === '2'"
         class='sign-no'>
      <img :src='icoLoading' />
      <div>加载中...</div>
    </div>
    <div v-if="allowNonuser === '1'">
      <div class='sign-panel'
           v-if="!signed">
        <div class='title'>
          <div>{{title}}</div>
          <div>{{date}}</div>
        </div>
        <template v-if="!tokenId">
          <div v-show="formPage === 'main'"
               class="form-page-main">
            <!-- type1:输入框 -->
            <div v-for="(item,i) in projects"
                 :key="i">
              <!-- type1:输入框 -->
              <item v-if="item.type === '1'"
                    :hasClick="false"
                    class="full-input">
                <input :placeholder="item.name"
                       v-model="item.content" />
              </item>
              <!-- type2:单选 -->
              <item v-if="item.type === '2'"
                    @click="handleFormPage(item.name, 'radio', item)"
                    :hasClick="true">
                <div slot="main">{{item.name}}</div>
                <div slot="remark">{{filterRadio(item.options)}}</div>
              </item>
              <!-- type3:多选 -->
              <item v-if="item.type === '3'"
                    @click="handleFormPage(item.name, 'select', item)"
                    :hasClick="true">
                <div slot="main">{{item.name}}</div>
                <div slot="remark">{{filterSelect(item.options)}}</div>
              </item>
            </div>
            <div class="button">
              <div class='btn'
                   @click="handleConfirm">提交</div>
            </div>
          </div>
          <div v-show="formPage === 'radio'"
               class="form-page-radio">
            <p class="category-title">{{itemNowTitle}}</p>
            <item v-for="(option, i) in itemNow.options"
                  :key="i"
                  @click="handleRadio(option)"
                  :hasArrow="false">
              <div slot="main"
                   v-html="option.content"></div>
            </item>
          </div>
          <div v-show="formPage === 'select'"
               class="form-page-select">
            <p class="category-title">{{itemNowTitle}}</p>
            <item v-for="(option, i) in itemNow.options"
                  :key="i"
                  @click="handleSelect(option)"
                  :hasArrow="false">
              <div slot="before">
                <i class="ico ico-select"
                   v-if="updateSelect"
                   :class="{'active':option.selected}"></i>
              </div>
              <div slot="main"
                   v-html="option.content"></div>
            </item>
            <div class="button">
              <div class='btn'
                   @click="handleSelectConfirm()">确认并返回</div>
            </div>
          </div>
          <!-- new form -->
        </template>
      </div>
      <div class='sign-success'
           v-if="signed">
        <div v-if="isRange === '1'">
          <img :src='icoSuccess' />
          <div>签到成功</div>
        </div>
        <div v-if="isRange === '2'"
             class='sign-no'>
          <img :src='icoNo' />
          <div>不在签到范围</div>
        </div>
      </div>
    </div>
    <div v-if="allowNonuser === '0'"
         class='sign-no'>
      <img :src='icoNo' />
      <div>本会议不支持外部人员签到</div>
    </div>
  </div>
</template>
<script>
'use strict'
import Api from './api'
import http from '@/utils/http'
import Check from '@/utils/check'
import MessageApi from '@/api/message'
import Cammand from '@/constant/cammand'
import MessageStatus from '@/constant/message'

export default {
  components: {},
  created() {
    this.tokenId = this.routeQuery('tokenId') || void 0
    this.userId = this.routeQuery('userId') || void 0
    this.clientId = this.routeQuery('clientId') || void 0
    this.groupId = this.routeQuery('groupId') || void 0
    this.msgId = this.routeQuery('msgId')
    this.lat = this.routeQuery('lat')
    this.lng = this.routeQuery('lng')
    this.address = this.routeQuery('address')
    this.addressTitle = this.routeQuery('addressTitle')
    this.appName = this.routeQuery('appName')
    this.title = this.routeQuery('title')
    this.appType = this.routeQuery('appType')
    this.status = this.routeQuery('status') || MessageStatus.CONFIRM
    this.date = this.routeQuery('date')

    // url如果有code和state，传入接口就会多返回一个{"meeting":{"relation":{}}}，直接提交
    this.code = this.$route.query.code || ''
    this.state = this.$route.query.state || ''
    Api.getMeetingData(this.msgId, this.code, this.state).then(res => {
      if (this.tokenId) {
        this.allowNonuser = '1'
      } else {
        // this.allowNonuser = res.meeting.allowNonuser
        this.allowNonuser = '1' // 全部显示显示表单
      }
      this.projects = res.meeting.items.map(v => {
        return { ...v, content: '' }
      })
      if (res.meeting.relation) {
        this.allowNonuser = '1'
        this.relation = res.meeting.relation
        // 直接提交
        this.handleConfirmByRelation()
      } else if (!this.tokenId) {
        this.allowNonuser = res.meeting.allowNonuser
      }
    })

    if (this.tokenId) {
      http.defaults.headers.common['clientId'] = this.clientId
      http.defaults.headers.common['tokenId'] = this.tokenId
      MessageApi.modifyMessage({
        id: this.msgId,
        groupId: this.groupId,
        type: '1041',
        msgJson: JSON.stringify({
          mapLocation: {
            point: {
              lat: this.lat,
              lng: this.lng
            },
            address: this.address,
            title: this.addressTitle
          }
        }),
        status: this.status
      })
        .then(res => {
          this.allowNonuser = '1'
          this.signed = true
          if (res.code === '5') {
            this.$message({ message: '不在签到范围', type: 'warning' })
            this.isRange = '2'
          }
        })
        .catch(res => {
          if (res.code === '5') {
            this.$message({ message: '不在签到范围', type: 'warning' })
            this.allowNonuser = '1'
            this.signed = true
            this.isRange = '2'
          } else {
            this.$message({ message: res.msg, type: 'warning' })
          }
        })
    }
    this.$web.postJsAction({
      type: Cammand.ACTION_TITLE,
      content: this.appName
    })
  },
  mounted() {
    let title = this.routeQuery('title')
    if (title) {
      document.title = title
    }
  },
  data() {
    return {
      formInput: '',
      formPage: 'main', // 翻页填写选项:main,radio,select
      itemNowTitle: '',
      itemNow: [],
      updateSelect: true,
      projects: [],
      records: [],
      signed: this.tokenId !== null && this.tokenId !== undefined,
      icoSuccess: `/static/ico/ico_success.png`,
      icoNo: `/static/ico/ico_no.png`,
      icoLoading: `/static/img_loading.gif`,
      isRange: '1', // 1在签到范围，2不在签到范围
      allowNonuser: '2' // 0不允许外部签到，1允许; 2加载中
    }
  },
  computed: {},
  methods: {
    filterRadio(options) {
      let option = {}
      options.map(o => {
        if (o.selected) {
          option = o
        }
      })
      return option.content
    },
    filterSelect(options) {
      let optionSelect = []
      options.map(o => {
        if (o.selected) {
          optionSelect.push(o)
        }
      })
      return optionSelect.length || ''
    },
    handleFormPage(title, type, item) {
      // 显示隐藏选项
      this.itemNowTitle = title
      this.itemNow = item
      this.formPage = type || 'main'
    },
    handleRadio(option) {
      // 处理选中数据并返回
      this.itemNow.options.map(option1 => {
        option1.selected = false
      })
      this.projects.map(item => {
        if (item.id === this.itemNow.id) {
          item.options.map(o => {
            o.selected = false
            if (o.id === option.id) {
              o.selected = true
            }
          })
        }
      })
      this.updateSelect = false
      this.updateSelect = true
      this.formPage = 'main'
    },
    handleSelect(option) {
      // 处理选中数据
      option.selected = !option.selected
      this.updateSelect = false
      this.updateSelect = true
    },
    handleSelectConfirm() {
      this.formPage = 'main'
    },
    handleConfirm() {
      let flag = true
      let empty = null
      let records = []
      this.projects.map(v => {
        if (flag && v.type === '1' && v.isMandatory === '1' && Check.isNullString(v.content)) {
          empty = v
          flag = false
        }
        if (v.type === '1') {
          records.push({ itemId: v.id, optionId: '0', value: v.content })
        } else if (v.type === '2' || v.type === '3') {
          v.options.map(o => {
            if (o.selected) {
              records.push({ itemId: o.itemId, optionId: o.id, value: o.content })
            }
          })
        }
      })

      if (!flag) {
        this.$message({ type: 'warning', message: `${empty.name}不能为空` })
        return false
      }
      // 验证手机号
      let isMolie = true
      let isAllSelect = true
      let isAllInput = true
      this.projects.map(v => {
        if (v.name === '手机') {
          if (!/^1[34578]\d{9}$/.test(v.content)) {
            this.$message({ type: 'warning', message: `手机号码格式不正确` })
            isMolie = false
          }
        }
        if ((v.type === '2' || v.type === '3') && v.isMandatory && v.isMandatory === '1') {
          // let isAllSelect = true
          isAllSelect = v.options.every(o => {
            return !o.selected
          })
          // 验证单选多选空
          if (isAllSelect) {
            this.$message({ type: 'warning', message: `选择题不能留空！` })
            return false
          }
        }
        // 如果存在单选多选
        if (v.type === '2' || v.type === '3') {
          isAllInput = false
        }
      })
      if (isAllInput) {
        isAllSelect = false
      }
      if (!isMolie || isAllSelect) {
        console.log('last')
        return false
      }

      this.records = records
      Api.sign({
        records: records,
        msgId: this.msgId,
        meetingItemRecordMapLocation: {
          point: {
            lat: this.lat,
            lng: this.lng
          },
          address: this.address,
          title: this.addressTitle
        }
      })
        .then(res => {
          if (res.code === '16') {
            this.allowNonuser = '0'
          } else if (res.code !== '1') {
            this.$message({ type: 'error', message: res.msg })
          } else {
            this.signed = true
          }
        })
        .catch(res => {
          if (res.code === '16') {
            this.allowNonuser = '0'
          } else if (res.code !== '1') {
            this.$message({ type: 'error', message: res.msg })
          } else {
            this.signed = true
          }
        })
    },
    // 有relation，就直接提交
    handleConfirmByRelation() {
      Api.sign({
        records: [],
        msgId: this.msgId,
        meetingItemRecordMapLocation: {
          point: {
            lat: this.lat,
            lng: this.lng
          },
          address: this.address,
          title: this.addressTitle
        },
        relation: this.relation
      })
        .then(res => {
          if (res.code === '16') {
            this.allowNonuser = '0'
          } else {
            this.signed = true
          }
        })
        .catch(res => {
          console.log(res)
          if (res.code === '16') {
            this.allowNonuser = '0'
          } else {
            this.signed = true
          }
        })
    }
  }
}
</script>
<style lang="scss">
  .sign-page {
    color: #444;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: nth($background, 2);
    padding: rem(40) rem(0);
    @include flex;
    @include jc;
    @include ai(flex-start);
    .sign-panel {
      margin: 0 auto;
      display: block;
      min-width: 260px;
      .title {
        text-align: center;
        padding: rem(10) rem(0);
        line-height: 1.5;
        max-width: 240px;
      }
      .input-div {
        @include flex;
        @include jc;
        margin: rem(10);
        input {
          width: rem(240);
          border: $border;
          padding-left: rem(10);
          height: rem(40);
          line-height: normal;
        }
      }
      .btn {
        margin-top: rem(10);
        width: rem(240);
      }
    }
    .sign-success {
      text-align: center;
      img {
        display: inline-block;
        margin-bottom: rem(15);
        width: rem(90);
      }
    }
    .sign-no {
      text-align: center;
      img {
        display: inline-block;
        margin-bottom: rem(15);
        width: rem(90);
      }
    }
  }
</style>
