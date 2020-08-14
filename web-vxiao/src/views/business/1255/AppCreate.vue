<template>
  <page title="新建打卡"
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
    <div class="punchClock-create">
      <Item :hasClick="false">
        <div slot="main">标题</div>
        <input slot="remark"
               placeholder="选填"
               v-model="form.title" />
      </Item>
      <item @click="handleTime">
        <div slot="main">时间</div>
        <div slot="remark"
             class="ellipsis"
             v-html="timeTxt"></div>
      </item>
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
                      :toolbars="['photo', 'file', 'at']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import CategoryApi from '@/api/category'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          title: '',
          time: null,
          display: '1',
          content: '',
          medias: []
        }
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
        punchClock: 'getPunchClock'
      }),
      isSwitched() {
        return this.form.display === '1'
      },
      timeTxt() {
        let time = this.form.time || {}
        return time.dayCount ? `${time.dayCount}天` : ''
      }
    },
    methods: {
      ...mapActions(['setPunchClock', 'deletePunchClockProp']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1255').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        const that = this
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          let json = JSON.parse(msgTmp.msgJson)
          this.form = {
            title: msgTmp.title,
            time: {
              periods: json.punchCategorys || [],
              dayCount: json.count || '',
              value: json.notifyTime || ''
            },
            display: msgTmp.remark
          }
          this.editorMessage = {
            content: msgTmp.content,
            medias: msgTmp.medias || []
          }
          that.deletePunchClockProp('form')
        } else if (that.punchClock.form) {
          that.form = { ...that.punchClock.form }
          if (that.punchClock.time) {
            that.form.time = that.punchClock.time
            that.deletePunchClockProp('time')
          }
        } else {
          CategoryApi.getCategorys({ type: '198' }).then(res => {
            let periods = res.categorys.map(v => {
              v.selected = true
              return v
            })
            this.form.time = { periods: periods, dayCount: 21 }
          })
        }
      },
      handleSwitch() {
        this.form.display = this.form.display === '1' ? '0' : '1'
      },
      handleTime() {
        this.setPunchClock({ form: this.form, time: this.form.time })
        this.routePush({ name: 'selectTime1255' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (!form.time) {
          that.$message({ message: '请设置时间', type: 'warning' })
          return false
        }
        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '打卡内容不能为空', type: 'warning' })
          return false
        }

        that.addMessage(that.getMessageData()).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.deletePunchClockProp('form')
          this.editorMessage = {}
          this.routeBack()
        })
      },
      getMessageData() {
        const that = this

        let form = this.form
        let message = that.constructionMessage({
          type: '1255',
          version: '1',
          groupId: that.groupId,
          title: form.title,
          remark: form.display,
          ...that.editorMessage
        })

        if (form.time) {
          message.msgJson = JSON.stringify({
            count: form.time.dayCount,
            notifyTime: form.time.value,
            punchCategorys: form.time.periods.map(v => {
              return {
                id: v.id,
                name: v.name,
                value: v.value
              }
            })
          })
        }
        return message
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.title) || Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '标题/内容至少填写一项', type: 'warning' })
          return false
        }

        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1255',
          type: '1',
          message: that.getMessageData()
        }

        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setPunchClock({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1255'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deletePunchClockProp('form')
          this.editorMessage = {}
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
