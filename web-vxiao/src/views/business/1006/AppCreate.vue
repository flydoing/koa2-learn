<template>
  <page title="新建通知"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <label slot="btn"
           @click='onDraft'>存草稿</label>
    <div class="category-title template"
         @click="onOptionalModule"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div class="notify-create">
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <item @click="handleInscription">
        <div slot="main">落款名称</div>
        <div slot="remark"
             v-html="inscriptionTxt"></div>
      </item>
      <template v-if="vscreenApp">
        <item class="n-time"
              :hasClick="false">
          <div slot="main">展示开始</div>
          <div slot="after">
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="选择时间"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"></el-date-picker>
          </div>
        </item>
        <item class="n-time"
              :hasClick="false">
          <div slot="main">展示结束</div>
          <div slot="after">
            <el-date-picker v-model="form.endTime"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="不限制"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"></el-date-picker>
          </div>
        </item>
        <item @click="handleTemplate">
          <div slot="main">模板</div>
          <div slot="remark"
               v-html="tmpTxt"></div>
        </item>
      </template>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic', 'open']" />
      </keep-alive>
      <div v-if="vscreenApp"
           class="button button-common"
           @click="handleScanning">预览</div>
    </div>
    <ScanTemplate :show.sync="showTemplate"
                  v-if="form.template"
                  :template="form.template"
                  :content="editorMessage.content" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      ScanTemplate: resolve => require(['./ScanTemplate'], resolve),
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {},
        showTemplate: false,
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
        notify: 'getCreateObject'
      }),
      vscreenApp() {
        let groupApps = this.baseInfo.app.groupRelations[this.groupId]
        if (Check.isRealArray(groupApps)) {
          return groupApps.filter(v => {
            return v.type === '1051'
          })[0]
        }
        return null
      },
      tmpTxt() {
        return this.form.template ? this.form.template.name : ''
      },
      inscriptionTxt() {
        return !Check.isNullObject(this.form.inscription) ? this.form.inscription.name : this.userInfo.name
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1006').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        const that = this
        this.form = { title: '', template: null, startTime: '', endTime: '' }
        if (that.notify.form) {
          that.form = { ...that.notify.form }
          if (that.notify.template) {
            that.form.template = that.notify.template
            that.setCreateObject({ template: null })
          }
          let inscription = this.getStorage('_inscription_cache')
          if (Check.isObject(inscription)) {
            this.form.inscription = inscription
          }
        } else {
          that.form.startTime = DateUtils.format(new Date(), DateUtils.YMD_HM)
        }
        // 拿到模板的数据
        let msgTemp = this.getStorage('_message_template_cache')
        let jsonTmp = msgTemp && msgTemp.msgJson ? JSON.parse(msgTemp.msgJson) : {}
        // console.log(msgTemp)
        if (msgTemp) {
          this.form = {
            title: msgTemp.title,
            times: msgTemp.times,
            startTime: msgTemp.times ? DateUtils.format_0800(msgTemp.times[0].setTime) : '',
            endTime: msgTemp.times ? DateUtils.format_0800(msgTemp.times[1].setTime) : '',
            inscription: {
              ...msgTemp.signature,
              name: jsonTmp.signature ? jsonTmp.signature.groupName : '',
              type: jsonTmp.signature ? jsonTmp.signature.groupType : ''
            },
            template: {
              ...msgTemp.tempLateDate,
              name: jsonTmp.tempLateDate ? jsonTmp.tempLateDate.tempName : ''
            }
          }
          this.editorMessage = {
            content: msgTemp.content,
            medias: msgTemp.medias || []
          }
        }
      },
      handleTemplate(item) {
        if (Check.isNullString(this.editorMessage.content)) {
          this.$message({ message: '通知内容不能为空', type: 'warning' })
          return false
        }
        this.setCreateObject({
          form: this.form,
          template: this.form.template,
          content: this.editorMessage.content
        })
        this.routePush({ name: 'selectTemplate1006' })
      },
      handleScanning() {
        // 预览
        if (!this.form.template) {
          this.$message({ message: '请选择模板', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          this.$message({ message: '通知内容不能为空', type: 'warning' })
          return false
        }

        this.showTemplate = true
      },
      handleInscription() {
        this.setCreateObject({ form: this.form })
        this.routePush({ name: 'selectInscription1016' })
      },
      commonality() {
        // 这里是公共的方法，新建和存草稿
        const that = this
        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '通知内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1006',
          groupId: that.groupId,
          isPrivate: '0',
          title: form.title,
          ...this.editorMessage
        })
        let mJson = {}
        if (this.vscreenApp) {
          if (Check.isNullString(form.startTime)) {
            that.$message({ message: '展示开始时间不能为空', type: 'warning' })
            return false
          }

          if (!form.template) {
            that.$message({ message: '请选择模板', type: 'warning' })
            return false
          }

          let times = [{ type: 'start', setTime: DateUtils.format_0800(form.startTime) }]
          if (!Check.isNullString(form.endTime)) {
            times.push({ type: 'end', setTime: DateUtils.format_0800(form.endTime) })
          }

          let tmp = form.template
          mJson = {
            ...mJson,
            tempLateDate: {
              backgroundImg: tmp.backgroundImg,
              backgroundColor: tmp.backgroundColor,
              fontColor: tmp.fontColor,
              fontSize: (tmp.size * 960) / 342,
              tempName: tmp.name
            }
          }
          postData.times = times
        }

        if (!Check.isNullObject(form.inscription)) {
          mJson = {
            ...mJson,
            signature: {
              id: form.inscription.id,
              groupId: form.inscription.groupId,
              groupName: form.inscription.name,
              groupType: form.inscription.type,
              parentId: form.inscription.parentId
            }
          }
        }

        if (!Check.isNullObject(mJson)) {
          postData.msgJson = JSON.stringify(mJson)
        }
        return postData
      },
      handleSubmit() {
        const that = this
        // this.commonality()指代的就是postData数据，但如果检验return的是false，就需要判断有没有数据
        let postData = this.commonality()
        if (!postData) {
          return false
        }
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setCreateObject({})
          this.editorMessage = {}
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setCreateObject({})
          this.editorMessage = {}
          this.routeBack()
        })
      },
      onDraft() {
        // 存草稿
        let postData = this.commonality()
        if (!postData) {
          return false
        }
        let postTemplate = {
          template: {
            groupId: this.groupId,
            appType: '1006',
            type: '2',
            userId: this.userId,
            message: {
              ...postData,
              title: this.form.title
            }
          }
        }
        Api.saveDraft(postTemplate).then(res => {
          this.$message({ type: 'success', message: '保存成功' })
          this.getTemplatesCount()
        })
      },
      onOptionalModule() {
        // 选择模板
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1006'
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .notify-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .n-time input {
      min-width: initial !important;
    }
  }
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
