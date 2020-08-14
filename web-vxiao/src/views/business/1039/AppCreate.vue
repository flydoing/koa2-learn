<template>
  <page title="新建工单"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="order-create">
      <item @click="handleType">
        <div slot="main">工单类型</div>
        <div slot="remark"
             v-html="typeTxt"></div>
      </item>
      <item @click="handleMember">
        <div slot="main">负责人</div>
        <div slot="remark"
             class="ellipsis"
             v-html="memberTxt"></div>
      </item>
      <item class="o-time"
            :hasClick="false">
        <div slot="main">截止时间</div>
        <div slot="after">
          <el-date-picker v-model="form.deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="工单内容"
                      :toolbars="['photo', 'file', 'emoji', 'at', 'topic', 'open']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import MessageApi from '@/api/message'
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
          type: null,
          deadline: '',
          members: [],
          message: null
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        order: 'getOrder'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      },
      memberTxt() {
        let mbs = this.form.members
        return mbs.length > 0
          ? mbs
              .map(v => {
                return v.name
              })
              .join('、')
          : ''
      }
    },
    methods: {
      ...mapActions(['setOrder']),
      fetchData() {
        const that = this
        that.msgId = that.routeQuery('msgId')
        if (that.order.form) {
          that.form = { ...that.order.form }

          if (that.order.users) {
            that.form.members = that.order.users
          }
          if (that.order.type) {
            that.form.type = that.order.type
            Api.getDefaultHandlers(that.currentGroup.groupId).then(res => {
              let tp = res.treatDefaults.filter(v => {
                return that.form.type.id === v.categoryId
              })[0]
              if (Check.isRealArray(tp.toUsers)) {
                that.form.members = tp.toUsers
              }
            })
            that.setOrder({ type: null })
          }
        } else if (that.msgId) {
          MessageApi.getMessageById(that.msgId).then(res => {
            let m = res.message
            that.form.content = m.content
            if (Check.isRealArray(m.times)) {
              that.form.deadline = DateUtils.format(m.times[0].setTime, DateUtils.YMD)
            }
            if (Check.isRealArray(m.toUsers)) {
              m.toUsers.forEach((v, i) => {
                if (v.type === 'to' && v.status !== 'd' && v.status !== '4') {
                  that.form.members.push(v)
                }
              })
            }
            that.form.type = { id: m.categoryId, name: m.categoryName }
            that.form.message = m
          })
        }
      },
      handleType(item) {
        this.setOrder({ form: this.form, type: this.form.type })
        this.routePush({ name: 'selectType1039' })
      },
      handleMember() {
        this.setOrder({ form: this.form, users: this.form.members })
        this.routePush({ name: 'selectMember1039' })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '工单内容不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        if (!form.type) {
          that.$message({ message: '请选择类型', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.members)) {
          that.$message({ message: '请选择负责人', type: 'warning' })
          return false
        }

        let users = []

        form.members.map(v => {
          users.push({
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'to'
          })
        })

        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1039',
          title: form.type.name,
          categoryId: form.type.id,
          groupId: that.currentGroup.groupId,
          toUsers: users,
          times: [
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.deadline)
            }
          ]
        })

        if (that.msgId) {
          postData.id = that.msgId
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            this.setOrder({ form: null })
            this.editorMessage = {}
            that.routeBack()
          })
        } else {
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            this.setOrder({ form: null })
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
          this.setOrder({ form: null })
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .order-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .o-time input {
      min-width: initial !important;
    }
  }
</style>
