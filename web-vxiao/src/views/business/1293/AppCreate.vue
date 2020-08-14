<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="meeting-create">
      <item :hasClick="false">
        <div slot="main">会议名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item class="m-time"
            :hasClick="false">
        <div slot="main">开始时间</div>
        <template v-if="canEdit">
          <div slot="after">
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"></el-date-picker>
          </div>
        </template>
        <template v-else>
          <div slot="remark"
               v-html="form.startTime"></div>
        </template>
      </item>
      <item @click="handleMember"
            :hasClick="canEdit">
        <div slot="main">参与人员</div>
        <div slot="remark"
             v-html="memberTxt"></div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="会议内容"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
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
  import * as Storage from '@/utils/storage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          startTime: '',
          endTime: '',
          members: [],
          place: null,
          setting: null
        }
      }
    },
    computed: {
      ...mapGetters({
        meeting: 'getMeeting'
      }),
      title() {
        return this.msgId ? '编辑视频会议' : '新建视频会议'
      },
      placeTxt() {
        return this.form.place ? this.form.place.name : ''
      },
      settingTxt() {
        let setting = this.form.setting || {}
        return setting.sign === '1' ? '开启' : ''
      },
      canEdit() {
        if (this.msgId) {
          return false
        }
        return true
      },
      memberTxt() {
        let mbs = this.form.members
        return mbs.length > 0 ? `${mbs.length}人` : ''
      },
      inscriptionTxt() {
        return !Check.isNullObject(this.form.inscription) ? this.form.inscription.name : this.userInfo.name
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setMeeting', 'deleteMeetingProp']),
      fetchData() {
        const that = this
        that.msgId = that.routeQuery('msgId')
        if (that.meeting.form) {
          that.form = { ...that.meeting.form }

          if (Check.isRealArray(that.meeting.users)) {
            that.form.members = that.meeting.users
            that.deleteMeetingProp('members')
          }
        } else {
          let projects = Storage.local.get('1293_projects', true) || []
          if (Check.isRealArray(projects)) {
            this.form.projects = projects
          }
        }
      },
      validateTime() {
        let form = this.form
        if (Check.isNullString(form.startTime)) {
          this.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        return true
      },
      handleMember() {
        this.setMeeting({ form: this.form, users: this.form.members })
        this.routePush({ name: 'selectMember1293' })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(form.name)) {
          that.$message({ message: '会议名称不能为空', type: 'warning' })
          return false
        }

        if (!that.validateTime()) {
          return false
        }

        if (!Check.isRealArray(form.members)) {
          that.$message({ message: '请选择参与人员', type: 'warning' })
          return false
        }

        let users = []
        if (that.message) {
          users = that.form.members
        } else {
          form.members.map(v => {
            users.push({
              avatar: v.avatar,
              name: v.name,
              type: 'enroll',
              userId: v.userId
            })
          })
        }

        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1293',
          title: form.name,
          groupId: that.currentGroup.groupId,
          isPrivate: 1,
          toUsers: users,
          msgType: form.setting ? form.setting.sign : 0,
          times: [
            {
              setTime: DateUtils.format_0800(form.startTime),
              type: 'start'
            }
          ],
          addressDates: [
            {
              // addressId: form.place.id,
              // address: form.place.name,
              startTime: DateUtils.format_0800(form.startTime)
              // endTime: DateUtils.format_0800(form.endTime)
            }
          ],
          version: 1
        })

        let mJson = {}
        // let setting = form.setting
        // if (setting && setting.sign === '1') {
        //   if (!Check.isRealArray(setting.projects)) {
        //     that.$message({ message: '考勤项目不能为空', type: 'warning' })
        //     return false
        //   }
        //   mJson = {
        //     meetingItem: setting.projects.map(v => {
        //       return { name: v.name, extension: v.extension || '' }
        //     }),
        //     mapLocation: setting.address,
        //     effectiveRange: setting.range,
        //     allowNonuser: setting.allowNonuser
        //   }
        // }

        if (!Check.isNullObject(this.form.inscription)) {
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

        if (that.message) {
          postData.id = that.message.id
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.deleteMeetingProp('form')
            Storage.local.set(
              `1293_projects`,
              JSON.stringify(
                form.projects.map(v => {
                  return { name: v.name, extension: v.extension || '' }
                })
              )
            )
            this.editorMessage = {}
            this.routeBack()
          })
        } else {
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.deleteMeetingProp('form')
            if (form.setting && form.setting.projects) {
              Storage.local.set(
                `1293_projects`,
                JSON.stringify(
                  form.setting.projects.map(v => {
                    return { name: v.name, extension: v.extension || '' }
                  })
                )
              )
            }
            // Storage.local.set(
            //   `1293_projects`,
            //   JSON.stringify(
            //     form.setting.projects.map(v => {
            //       return { name: v.name, extension: v.extension || '' }
            //     })
            //   )
            // )
            this.editorMessage = {}
            this.routeBack()
          })
        }
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteMeetingProp('form')
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .meeting-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .m-time input {
      min-width: initial !important;
    }
  }
</style>
