<template>
  <div class="eidt-section">
    <item :hasClick="false">
      <div slot="main">名称</div>
      <input slot="remark"
             type="text"
             placeholder="必填"
             v-model="title">
    </item>
    <item :hasClick="false">
      <div slot="main">作者</div>
      <input slot="remark"
             type="text"
             placeholder="选填"
             v-model="author">
    </item>
    <item v-if="showBol"
          :hasClick="false">
      <SettingBar :datas="cacheDatas"
                  :index="index"></SettingBar>
      <span slot="after"></span>
    </item>
    <!-- <editor v-model="content" :options="editorOptions"  ></editor> -->
    <TextInput placeholder="诵读内容"
               v-model="content"></TextInput>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve),
      SettingBar: resolve => require(['./ChantSettingBar'], resolve)
    },
    props: {
      showBol: {
        type: Boolean,
        default: true
      },
      defaultDatas: {
        type: Object,
        default() {
          return {}
        }
      },
      datas: {
        type: Object,
        default() {
          return null
        }
      },
      index: {
        type: [Number, String]
      }
    },
    computed: {
      ...mapGetters({
        cacheMsgJson: 'getMsgJson'
      }),
      title: {
        get() {
          let strTitle = ''
          if (this.cacheMsgJson.defaultDatas[this.index].title) {
            strTitle = this.cacheMsgJson.defaultDatas[this.index].title
          } else {
            strTitle = this.defaultDatas.title
          }
          return strTitle
        },
        set(v) {
          let datas = JSON.parse(JSON.stringify(this.cacheMsgJson.defaultDatas))
          let curData = {
            ...datas[this.index],
            title: v
          }
          datas.splice(this.index, 1, curData)
          this.saveChantMsgJson({
            ...this.cacheMsgJson,
            defaultDatas: datas
          })
        }
      },
      author: {
        get() {
          let strAuthor = ''
          if (this.cacheMsgJson.defaultDatas[this.index].author) {
            strAuthor = this.cacheMsgJson.defaultDatas[this.index].author
          } else {
            strAuthor = this.defaultDatas.author
          }
          return strAuthor
        },
        set(v) {
          let datas = JSON.parse(JSON.stringify(this.cacheMsgJson.defaultDatas))
          let curData = {
            ...datas[this.index],
            author: v
          }
          datas.splice(this.index, 1, curData)
          this.saveChantMsgJson({
            ...this.cacheMsgJson,
            defaultDatas: datas
          })
        }
      },
      content: {
        get() {
          let content = ''
          if (this.cacheMsgJson.defaultDatas[this.index].content) {
            content = this.cacheMsgJson.defaultDatas[this.index].content
          } else {
            content = this.defaultDatas.content
          }
          return content
        },
        set(v) {
          let datas = JSON.parse(JSON.stringify(this.cacheMsgJson.defaultDatas))
          let curData = {
            ...datas[this.index],
            content: v
          }
          datas.splice(this.index, 1, curData)
          this.saveChantMsgJson({
            ...this.cacheMsgJson,
            defaultDatas: datas
          })
        }
      }
    },
    data() {
      return {
        editorOptions: {
          modules: {
            toolbar: [
              {
                align: ''
              },
              {
                align: 'right'
              },
              {
                align: 'center'
              }
            ]
          }
        }
      }
    },
    created() {
      if (this.cacheMsgJson.hasOwnProperty('isEdit')) {
        this.cacheDatas = JSON.parse(JSON.stringify(this.cacheMsgJson))
      } else {
        this.cacheDatas = { ...this.datas }
      }
    },
    methods: {
      ...mapActions(['saveChantMsgJson']),
      // getsingleSetting(obj) {
      //   this.$set(this.importData, 'settings', obj)
      // }.
      listenChange(obj) {}
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .ql-toolbar {
    &.ql-snow {
      border: #ededed solid 1px !important;
      border-top: none !important;
    }
  }

  .ql-container {
    &.ql-snow {
      border: #ededed solid 1px !important;
      border-top: none !important;
    }
  }

  .ql-editor {
    min-height: rem(100);
  }
</style>
