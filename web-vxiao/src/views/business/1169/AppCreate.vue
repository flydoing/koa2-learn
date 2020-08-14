<template>
  <page title="新建活动"
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
      <Item :hasClick="false"
            class="full-input">
        <input placeholder="标题"
               v-model="form.title" />
      </Item>
      <item :hasClick="false">
        <div slot="main">时间</div>
        <div slot="after">
          <el-date-picker v-model="form.time"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="简介（限200字）"
                      :toolbars="['photo']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
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
          time: ''
        },
        count: ''
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.getTemplatesCount()
    },
    activated() {
      let msgTmp = this.getStorage('_message_template_cache')
      if (msgTmp) {
        this.form.title = msgTmp.title
        if (msgTmp.times) {
          this.form.time = DateUtils.format(msgTmp.times[0].setTime, 'yyyy-MM-dd hh:mm')
        }
        this.editorMessage = {
          content: msgTmp.content,
          medias: msgTmp.medias
        }
        this.modifyCreateObjectField('form')
      } else if (this.obj.form) {
        this.form = JSON.parse(JSON.stringify(this.obj.form))
        this.modifyCreateObjectField('form')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1169').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (!form.title) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }
        if (!form.time) {
          that.$message({ message: '时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '活动简介不能为空', type: 'warning' })
          return false
        }
        if (this.editorMessage.content.length > 200) {
          that.$message({ message: '活动简介不能超200字', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(this.editorMessage.medias)) {
          that.$message({ message: '请上传一张活动主题封面', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1169',
          groupId: that.groupId,
          title: form.title,
          times: [
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.time)
            }
          ],
          ...this.editorMessage
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.routeBack()
        })
      },
      handleSaveDraft() {
        const that = this
        let form = that.form
        let editor = that.editorMessage
        if (Check.isNullString(editor.content) && Check.isNullString(form.title)) {
          that.$message({ message: '标题/活动简介至少输入一项', type: 'warning' })
          return false
        }
        if (editor.content.length > 200) {
          that.$message({ message: '活动简介不能超200字', type: 'warning' })
          return false
        }
        let message = that.constructionMessage({
          type: '1169',
          groupId: that.groupId,
          title: form.title,
          ...editor
        })
        if (form.time) {
          message.times = [
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.time)
            }
          ]
        }
        let postData = {
          groupId: that.groupId,
          userId: that.userId,
          appType: '1169',
          type: '1',
          message: message
        }
        MessageApi.saveMessageTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.getTemplatesCount()
        })
      },
      handleMsgTemplate() {
        this.setCreateObject({ form: this.form })
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1169'
          }
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
