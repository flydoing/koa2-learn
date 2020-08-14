<template>
  <Page title="报名审核">
    <item v-for="(item,i) in operates"
          :key="i"
          @click="handleResult(item, i)"
          :label="item.name"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <TextInput placeholder="输入内容"
               :max="50"
               v-model="remark" />
    <div class="commin-btn">
      <button @click="handleSubmit">提交</button>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        operates: [
          {
            name: '审核通过',
            type: '2',
            selected: true
          },
          {
            name: '审核不通过',
            type: '1',
            selected: false
          }
        ],
        remark: ''
      }
    },
    created() {
      if (this.routeQuery('tokenId') || this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('tokenId') || this.routeQuery('token')
      }
    },
    methods: {
      handleResult(item, i) {
        this.operates = this.operates.map(v => {
          v.selected = item.type === v.type
          return v
        })
      },
      handleSubmit() {
        let op = this.operates.filter(v => {
          return v.selected
        })[0]
        Api.audit({
          msgId: this.routeQuery('msgId'),
          datas: [
            {
              key: this.routeQuery('key'),
              type: op.type,
              value: this.remark
            }
          ]
        }).then(res => {
          this.routeBack()
          if (res && res.code === '1') {
            this.$web.postJsAction({
              type: 'activityEnrollAudit',
              extension: this.routeQuery('serialNumber'),
              status: 1
            })
            Api.loadOnceMessage(this.routeQuery('msgId')).then(res => {
              if (res && res.code === '1') {
                this.$web.postJsAction({
                  type: 'AuditComplete',
                  message: res.message
                })
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
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
</style>
