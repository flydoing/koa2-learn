<template>
  <Card v-if="isSchool"
        :message="message"
        @detail="handleDetail">
    <template slot="toolbar">
      <div class="card-counter">
        <div class="counter text-label left">已阅{{message.readCount}}</div>
        <div class="counter right">
          <span>
            <i :class="icoPraise"
               @click="handlePraise"></i>
            <span class="number f12"
                  v-if="praises.length > 0">{{praises.length}}</span>
          </span>
          <i class="ico ico-reply"
             @click="onParticulars"></i>
          <span class="number f12"
                v-if="message.reviewCount > 0">{{message.reviewCount}}</span>
        </div>
      </div>
    </template>
    <CardImages slot="images"
                :images="m.images"
                :single="true"
                v-if="m.images.length>0"></CardImages>
    <div slot="content"
         class="card-content">
      <Commend :commendation="commendation"></Commend>
    </div>
    <CardHref v-if="button"
              :content="button.text"
              @click="onParticulars" />
  </Card>
  <Card v-else
        :message="message">
    <div slot="content"
         class="card-content">
      <Commend :commendation="commendation"></Commend>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {
      Commend: resolve => require(['./Commend'], resolve)
    },
    computed: {
      button() {
        return {
          text: '查看详情',
          handle: this.detailHanle
        }
      },
      m() {
        let _m = this.converMessage(this.message)
        if (this.isSchool) {
          _m.label = this.message.businessName
          if (_m.images.length > 0) {
            _m.images = [_m.images[0]]
          }
        }
        return _m
      },
      commendation() {
        let _m = this.message
        let cmdn = {
          date: '',
          member: '',
          content: '',
          logo: '',
          groupName: '',
          mCount: _m.extensionType
        }

        try {
          let json = JSON.parse(_m.msgJson)
          if (!Check.isNullObject(json)) {
            cmdn.groupName = json.groupName
            cmdn.logo = json.logo
          }

          if (Check.isArray(_m.toUsers)) {
            let users = []
            _m.toUsers.map(function(user) {
              if (user.type !== 'creator') {
                users.push(user)
              }
            })

            let userTxt = ''
            userTxt = users
              .map(function(user) {
                return user.name
              })
              .join('、')
            cmdn.users = users
            cmdn.member = userTxt.length > 18 ? `${userTxt.substring(0, 18)}...` : userTxt
            cmdn.date = DateUtils.format(_m.createTime, DateUtils.YMD)
            cmdn.content = _m.content.length > 76 ? `${_m.content.substring(0, 76)}...` : _m.content
          }
        } catch (e) {}
        return cmdn
      },
      praises() {
        // 判断praise 中isPraise 为1状态的数据
        let _praises = this.message.praises || []
        return _praises.filter(p => {
          return p.isPraise === 1
        })
      },
      icoPraise() {
        let _praises =
          this.praises.filter(p => {
            return p.userId === this.userId
          }) || []
        return [
          `ico`,
          {
            [`ico-heart`]: _praises.length === 0,
            [`ico-heart-press`]: _praises.length > 0
          }
        ]
      }
    },
    methods: {
      ...mapActions(['setCommend']),
      handleDetail() {
        this.setCommend(this.commendation)
        this.routePushModel({
          name: 'detail1048',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      },
      onParticulars() {
        this.setCommend(this.commendation)
        this.routePushModel({
          name: 'detail1048',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .number {
    color: #9f9f9f;
  }
  span:hover {
    cursor: pointer;
  }
</style>
