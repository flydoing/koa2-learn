<template>
  <page title="新建公告"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack
        @scrolling="scrolling">
    <div class="notice-create"
         slot="top">
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
      <item class="n-time"
            :hasClick="false">
        <div slot="main">展示时间（开始）</div>
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item class="n-time"
            :hasClick="false">
        <div slot="main">展示时间（结束）</div>
        <div slot="after">
          <el-date-picker v-model="form.endTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
      <item @click="handleRange">
        <div slot="main">范围</div>
        <div slot="remark"
             class="ellipsis"
             v-html="rangeTxt"></div>
      </item>
    </div>
    <div class="editor-item"
         v-if="maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="editorMessage"
                :height="maxHeight"
                placeholder="公告内容" />
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
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
    },
    data() {
      return {
        form: {
          title: '',
          startTime: null,
          endTime: null,
          content: '',
          medias: [],
          postData: {}
        },
        maxHeight: 0
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        notice: 'getCreateObject'
      }),
      rangeTxt() {
        let places = this.notice.places || []
        let classes = this.notice.classes || []
        let groups = this.notice.groups || []
        let ranges = [...places, ...classes, ...groups]
        return ranges.length > 0
          ? ranges
              .map(v => {
                return v.name
              })
              .join('、')
          : '全部'
      },
      inscriptionTxt() {
        return !Check.isNullObject(this.form.inscription) ? this.form.inscription.name : this.userInfo.name
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        if (this.notice.form) {
          this.form = { ...this.notice.form }
          let inscription = this.getStorage('_inscription_cache')
          if (Check.isObject(inscription)) {
            this.form.inscription = inscription
          }
        }
      },
      handleInscription() {
        this.setCreateObject({ form: this.form })
        this.routePush({ name: 'selectInscription1016' })
      },
      scrolling(status) {
        this.$children[0].$children[4].$children[0].$refs._toolbar.style.top = `${status.offset.y}px`
      },
      handleRange() {
        this.setCreateObject({ form: this.form })
        this.routePush({ name: 'selectRange1051' })
      },
      handleSubmit() {
        const that = this
        let style =
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">'

        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(that.editorMessage.content)) {
          that.$message({ message: '公告内容不能为空', type: 'warning' })
          return false
        }

        // if (Check.isNullString(form.startTime)) {
        // that.$message({ message: '开始时间不能为空', type: 'warning' })
        // return false
        // }

        // if (Check.isNullString(form.endTime)) {
        // that.$message({ message: '结束时间不能为空', type: 'warning' })
        // return false
        // }

        if (new Date(form.startTime).getTime() > new Date(form.endTime).getTime()) {
          that.$message({ message: '开始时间不能大于结束时间', type: 'warning' })
          return false
        }

        let toUsers = []
        if (Check.isRealArray(this.notice.places)) {
          this.notice.places.some(v => {
            toUsers.push({
              name: v.name,
              type: 'cc',
              userId: v.id,
              userType: 'place'
            })
          })
        }

        if (Check.isRealArray(this.notice.classes)) {
          this.notice.classes.some(v => {
            toUsers.push({
              name: v.name,
              type: 'cc',
              userId: v.id,
              userType: 'class'
            })
          })
        }
        if (Check.isRealArray(this.notice.groups)) {
          this.notice.groups.some(v => {
            toUsers.push({
              name: v.name,
              type: 'cc',
              userId: v.id,
              userType: 'group'
            })
          })
        }

        let msgJson = {}
        if (!Check.isNullObject(this.form.inscription)) {
          msgJson = {
            signature: {
              id: form.inscription.id,
              groupId: form.inscription.groupId,
              groupName: form.inscription.name,
              groupType: form.inscription.type,
              parentId: form.inscription.parentId
            }
          }
        }
        // 判断时间是不是为空
        if (Check.isNullString(form.endTime) || Check.isNullString(form.startTime)) {
          that.editorMessage.content = that.editorMessage.content.replace('cstyle', 'style')
          this.postData = that.constructionMessage({
            ...that.editorMessage,
            type: '1016',
            title: form.title,
            groupId: that.currentGroup.groupId,
            isPrivate: Check.isRealArray(toUsers) ? '1' : void 0,
            msgJson: JSON.stringify(msgJson),
            isComment: 1,
            content: `${style}${that.editorMessage.content}</div></body></html>`,
            toUsers: toUsers,
            medias: that.editorMessage.medias
          })
        } else {
          that.editorMessage.content = that.editorMessage.content.replace('cstyle', 'style')
          this.postData = that.constructionMessage({
            ...that.editorMessage,
            type: '1016',
            title: form.title,
            groupId: that.currentGroup.groupId,
            isPrivate: Check.isRealArray(toUsers) ? '1' : void 0,
            msgJson: JSON.stringify(msgJson),
            isComment: 1,
            times: [
              {
                type: 'start',
                setTime: DateUtils.format_0800(form.startTime) || ''
              },
              {
                type: 'end',
                setTime: DateUtils.format_0800(form.endTime) || ''
              }
            ],
            content: `${style}${that.editorMessage.content}</div></body></html>`,
            toUsers: toUsers,
            medias: that.editorMessage.medias
          })
        }
        that.addMessage(this.postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
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
          this.setCreateObject({ form: null })
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .notice-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .n-time input {
      min-width: initial !important;
    }
  }
  .el-icon-time {
    display: none;
  }
</style>
