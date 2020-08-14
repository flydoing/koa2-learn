<template>
  <Card :message="msg">
    <CardDown slot="down"
              :m="msg">
      <el-dropdown-item v-if="isAdmin || msg.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <span slot="label"
          class="text-color has-click"
          @click="handleInscription"
          v-html="labelTxt"></span>
    <CardContent slot="content"
                 :content="m.content">
      <div>{{msg.title}}</div>
    </CardContent>
    <template slot="images">
      <CardImages :images="m.images"
                  listenEvent
                  @callback="handleQrcode" />
    </template>
    <template slot="href"
              v-if="userId == m.fromUserId">
      <CardHref content="会议纪要"
                @click="handleMetting"></CardHref>
    </template>
    <template slot="href"
              v-else-if="joinIn">
      <el-dropdown trigger="click"
                   @command="handleJoin">
        <div class="el-dropdown-link">
          <CardHref content="是否参加"></CardHref>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(op,i) in operates"
                            :key="i"
                            :op="op"
                            :command="op">{{op.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <CardHref slot="href"
              content="查看详情"
              @click="handleDetail"></CardHref>
    <template slot="counter">
      <span>反馈{{msg.readCount || 0}}</span>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import { mapActions } from 'vuex'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {},
    data() {
      return {
        msg: { ...this.message, readed: this.message.readed || 0 },
        operates: [
          {
            name: '确认参加',
            value: 4
          },
          {
            name: '无法参加',
            value: 5
          }
        ]
      }
    },
    computed: {
      m() {
        let _m = this.converMessage(this.msg)
        if (Check.isArray(_m.addressDates)) {
          let ad = _m.addressDates[0]
          _m.sTime = DateUtils.format(ad.startTime, DateUtils.MDHM)
          _m.eTime = DateUtils.format(ad.endTime, DateUtils.MDHM)
          _m.addressTxt = ad.address
          _m.content = `时间：${_m.sTime} 至 ${_m.eTime}<br>地点：${_m.addressTxt}<br>${_m.content}`
        }
        return _m
      },
      qrcode() {
        let code = this.m.images.filter(v => {
          return v.extensionType === 'qr_code_flag'
        })[0]
        let mJson = JSON.parse(this.m.msgJson || '{}')
        let title = `${this.m.title}<br>时间：${this.m.sTime}至${this.m.eTime}<br>场所：${this.m.addressTxt}`
        if (mJson.mapLocation) {
          let rangeTxt = mJson.effectiveRange ? `（${mJson.effectiveRange}米内）` : ''
          title = `${title}<br>签到地点：${mJson.mapLocation.title}${rangeTxt}`
        }
        return { ...(code || {}), title: title }
      },
      joinIn() {
        let _m = this.msg
        if (!_m.readed || (_m.readed !== 4 && _m.readed !== 5)) {
          if (Check.isArray(_m.addressDates) && new Date().getTime() - new Date(_m.addressDates[0].endTime).getTime() < 0) {
            return true
          }
        }
        return false
      },
      inscription() {
        if (this.m.msgJson) {
          return JSON.parse(this.m.msgJson).signature
        }
        return false
      },
      labelTxt() {
        if (this.inscription) {
          return this.inscription.groupName
        }
        return this.m.label
      }
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/message/edit',
          query: {
            msgId: this.message.id,
            title: this.message.businessName
          }
        })
      },
      handleQrcode() {
        this.setStorage('_qrcode_cache', this.qrcode)
        window.open('/html5/pages/qrcodePreview')
      },
      handleMetting() {
        if (this.msg.children) {
          this.routePushModel({
            name: 'minutes1040',
            params: { msgId: this.message.children[0].id }
          })
        } else {
          this.routePushModel({
            name: 'addMinutes1040',
            params: { msgId: this.message.id }
          })
        }
      },
      handleJoin(op) {
        let m = this.msg
        MessageApi.modifyMessageReaded({
          userId: this.userId,
          msgId: m.id,
          readed: op.value
        }).then(res => {
          m.readed = op.value
          m.readCount = res.messages[0].readCount
          this.msg = m
          this.modifyChannelMessage(m)
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleDetail() {
        this.routePushModel({
          name: 'detail1040',
          query: {
            msgId: this.message.id
          }
        })
      },
      handleInscription() {
        let ins = this.inscription
        if (ins) {
          if (ins.groupType === '18') {
            this.routePushModel({
              path: '/vx/group/user/team/detail',
              query: {
                groupId: ins.groupId
              }
            })
          } else {
            this.routePushModel({
              path: '/vx/group/about',
              query: {
                groupId: ins.groupId
              }
            })
          }
        } else {
          this.userDetail()
        }
      }
    }
  }
</script>
