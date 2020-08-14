<template>
  <div class="agree-input">
    <page :titleBorder="false">
      <div slot="main">
        <TextInput v-model="text"
                   :placeholder="placeholder"
                   :max="50" />
        <div class="commin-btn">
          <button @click="handleSure">确定</button>
        </div>
      </div>
    </page>
  </div>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        text: '',
        placeholder: '不同意理由（不超过50个字）'
      }
    },
    methods: {
      handleSure() {
        let req = {
          msgId: this.routeQuery('msgId'),
          datas: [
            {
              type: 1,
              value: this.text,
              key: this.routeQuery('key')
            }
          ]
        }
        Api.audit(req).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
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
</style>
