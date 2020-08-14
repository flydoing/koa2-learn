<template>
  <page title="新建接龙"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <label slot="btn"
           @click="handleSaveDraft">存草稿</label>
    <div class="category-title template"
         @click="handleMsgTemplate"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div class="solitaire-create">
      <Item @click="handleWay">
        <div>接龙方式</div>
        <div slot="remark"
             v-if="form.way"
             class="ellipsis"
             v-html="form.way.name"></div>
      </Item>
      <item>
        <div slot="main">相互可见打卡内容</div>
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="输入内容"
                      :toolbars="['photo', 'file', 'at', 'topic']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve),
      SelectWay: resolve => require(['./SelectWay'], resolve)
    },
    data() {
      return {
        form: {
          way: {
            name: '综合：文本、图片、视频、语音、附件',
            value: '1',
            selected: true
          },
          display: '1'
        },
        count: ''
      }
    },
    created() {
      this.getTemplatesCount()
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        solitaire: 'getSolitaire'
      }),
      isSwitched() {
        return this.form.display === '1'
      }
    },
    methods: {
      ...mapActions(['setSolitaire', 'deleteSolitaireProp']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1257').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          let json = JSON.parse(msgTmp.msgJson)
          let way = null
          if (json.methods === '1') {
            way = {
              name: '综合：文本、图片、视频、语音、附件',
              value: '1',
              selected: true
            }
          } else {
            way = {
              name: '选择',
              value: '2',
              selected: true,
              options: json.questions[0].options
            }
          }
          this.form = {
            way: way,
            display: json.openEachOther
          }
          this.editorMessage = {
            content: msgTmp.content,
            medias: msgTmp.medias || []
          }
          this.deleteSolitaireProp('form')
        } else if (this.solitaire.form) {
          this.form = { ...this.solitaire.form }
          if (this.solitaire.way) {
            this.form.way = this.solitaire.way
            this.deleteSolitaireProp('way')
          }
        }
      },
      handleWay() {
        this.setSolitaire({ form: this.form, way: this.form.way })
        this.routePush({ name: 'selectWay1257' })
      },
      handleSwitch() {
        this.form.display = this.form.display === '1' ? '0' : '1'
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (!form.way) {
          that.$message({ message: '请选择接龙方式', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '接龙内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1257',
          groupId: that.groupId,
          remark: form.display,
          msgType: '1',
          ...this.editorMessage
        })

        if (form.way.value === '2') {
          let questions = [
            {
              title: this.editorMessage.content,
              options: form.way.options
            }
          ]
          postData = {
            ...postData,
            msgJson: JSON.stringify({ questions: questions }),
            msgType: form.way.type === 1 ? '2' : '3',
            content: ''
          }
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.deleteSolitaireProp('form')
          this.routeBack()
        })
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '接龙内容不能为空', type: 'warning' })
          return false
        }

        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1257',
          type: '1',
          message: {
            content: that.editorMessage.content,
            medias: that.editorMessage.medias || []
          }
        }

        if (form.way) {
          postData.message.msgJson = JSON.stringify({
            questions: [
              {
                title: that.editorMessage.content,
                options: form.way.options
              }
            ],
            methods: form.way.value,
            openEachOther: form.display
          })
        }

        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setSolitaire({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1257'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.deleteSolitaireProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
