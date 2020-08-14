<template>
  <page title="新建周记"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="journal-create">
      <item @click="handleTime">
        <div slot="main">周期</div>
        <div slot="remark"
             v-html="timeTxt"></div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="本周计划"
                      :toolbars="['emoji', 'at', 'topic']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          time: null,
          content: '',
          medias: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        journal: 'getJournal'
      }),
      timeTxt() {
        return this.form.time ? this.form.time.remark : ''
      }
    },
    methods: {
      ...mapActions(['setJournal']),
      fetchData() {
        const that = this
        if (that.journal.form) {
          that.form = { ...that.journal.form }

          if (that.journal.time) {
            that.form.time = that.journal.time
          }
        } else {
          let date = new Date()
          let sTime = DateUtils.getWeekDate(date, 'start')
          let eTime = DateUtils.getWeekDate(date, 'end')
          let s = sTime.getFullYear() > date.getFullYear()
          let e = eTime.getFullYear() > date.getFullYear()

          that.form.time = {
            remark: `${DateUtils.format(sTime, s ? 'yyyy-MM-dd' : 'MM-dd')} 至 ${DateUtils.format(eTime, e ? 'yyyy-MM-dd' : 'MM-dd')}`,
            label: `${DateUtils.format(sTime, s ? 'yyyy.MM.dd' : 'MM.dd')} 至 ${DateUtils.format(eTime, e ? 'yyyy.MM.dd' : 'MM.dd')}`,
            data: [
              {
                setTime: DateUtils.format_0800(sTime),
                type: 'start'
              },
              {
                setTime: DateUtils.format_0800(eTime),
                type: 'end'
              }
            ]
          }
        }
      },
      handleTime() {
        this.setJournal({ form: this.form })
        this.routePush({ name: 'selectTime1034' })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '周计划不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1034',
          groupId: that.currentGroup.groupId,
          times: form.time.data,
          title: `周计划（${form.time.label}）`,
          businessName: '周计划',
          toUsers: [],
          isPrivate: '0',
          ...this.editorMessage
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setJournal({ form: null })
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
          this.setJournal({ form: null })
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
