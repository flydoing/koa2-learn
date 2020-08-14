<template>
  <Card :message="message">
    <template slot="images">
      <CardImages :images="m.images"
                  listenEvent
                  @callback="handleQrcode" />
    </template>
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin || m.fromUserId == userId"
                        @click.native.stop="handleModifyDeadline">修改截止时间</el-dropdown-item>
    </CardDown>
    <div slot="href"
         class="text-color">
      <span @click="handleDetail(true)">查看详情</span>
      <template v-if="!joinIn">
        &nbsp;|&nbsp;
        <span @click="handleDetail(false)">开始作答</span>
      </template>
    </div>
    <span slot="counter">已答{{message.readCount || 0}}</span>
    <Overlay :show.sync="showQrcode"
             width="400">
      <div class="qrcode-container">
        <div v-html="qrcode.title"></div>
        <img v-lazy="{src:qrcode.src}" />
      </div>
    </Overlay>
  </Card>
</template>
<script>
  import DateUtils from '@/utils/date'
  // import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    components: {},
    data() {
      return {
        showQrcode: false
      }
    },
    computed: {
      joinIn() {
        return this.message.readed === 1
      },
      qrcode() {
        let code =
          this.m.images.filter(v => {
            return v.extensionType === 'qr_code_flag'
          })[0] || {}
        return { ...code, title: `问卷标题：${this.m.title}<br>截止时间：${this.m.expirationDate}` }
      },
      m() {
        let _m = this.converMessage(this.message)
        let msgJson = JSON.parse(_m.msgJson)
        if (msgJson) {
          let ad = msgJson
          // let ad = _m.addressDates[0]
          _m.sTime = DateUtils.format(ad.startTime, DateUtils.MDHM)
          _m.eTime = DateUtils.format(ad.endTime, DateUtils.MDHM)
          _m.expirationDate = DateUtils.format(ad.expirationDate, DateUtils.MDHM)
          _m.title = ad.title
          _m.explain = ad.explain
          _m.content = `时间：${_m.sTime} 至 ${_m.eTime}<br>地点：${_m.addressTxt}<br>${_m.content}`
        }
        return _m
      }
    },
    methods: {
      handleDetail(value) {
        this.routePushModel({
          name: 'detail1042',
          params: {
            msgId: this.message.id
          },
          query: {
            joinIn: value ? 1 : 0,
            title: '问卷详情'
          }
        })
      },
      handleModifyDeadline() {
        this.routePushModel({
          name: 'modifyDeadline1042',
          query: {
            msgId: this.message.id
          }
        })
      },
      // handleQrcode(img) {
      //   if (img.extensionType === 'qr_code_flag') {
      //     this.showQrcode = true
      //   }
      // },
      handleQrcode() {
        this.setStorage('_qrcode_cache', this.qrcode)
        window.open('/html5/pages/qrcodePreview')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .qrcode-container {
    width: rem(400);
    background: #fff;
    height: rem(400);
    @include ct;
    @include fd;
    img {
      width: rem(250);
      height: rem(250);
    }
    div {
      text-align: center;
      margin-bottom: rem(15);
    }
  }
</style>
