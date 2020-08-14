<template>
  <page title="新建审批"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <div class="approve-create">
      <item @click="handleType">
        <div slot="main">表单</div>
        <div slot="remark"
             v-html="typeTxt"></div>
      </item>
      <template v-if="form.formItems.length>0">
        <template v-for="(item,i) in form.formItems">
          <item v-if="item.type == '1'"
                :hasClick="false"
                :key="i">
            <div slot="main"
                 v-html="item.name"></div>
            <input slot="remark"
                   placeholder="输入内容"
                   v-model="item.content" />
          </item>
          <item v-else-if="item.type == '2'"
                :hasClick="false"
                :key="i">
            <div slot="main"
                 v-html="item.name"></div>
            <input slot="remark"
                   placeholder="输入数值"
                   v-model="item.content" />
          </item>
          <item v-else-if="item.type == '3'"
                @click="handleMember(item)"
                :key="i">
            <div slot="main"
                 v-html="item.name"></div>
            <div slot="remark"
                 v-html="memberTxt(item)"></div>
          </item>
          <item v-else-if="item.type == '4'"
                class="apv-time"
                :hasClick="false"
                :key="i">
            <div slot="main"
                 v-html="item.name"></div>
            <div slot="after">
              <el-date-picker v-model="item.content"
                              prefix-icon="x"
                              type="date"
                              placeholder="选择日期"
                              value-format="yyyy-MM-dd"
                              format="yyyy-MM-dd"
                              :clearable="false"></el-date-picker>
            </div>
          </item>
          <item v-else-if="item.type == '6'"
                @click="handleItem(item)"
                :key="i"
                :label="item.name"
                :remark="item.content">
          </item>
          <item v-else
                class="apv-time"
                :hasClick="false"
                :key="i">
            <div slot="main"
                 v-html="item.name"></div>
            <div slot="after">
              <el-time-picker v-model="item.content"
                              prefix-icon="x"
                              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                              placeholder="选择时间"
                              format="HH:mm"
                              value-format="HH:mm"
                              :clearable="false"></el-time-picker>
            </div>
          </item>
        </template>
      </template>
      <item @click="handleApprover">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-html="approverTxt"></div>
      </item>
      <item @click="handleExecutor">
        <div slot="main">执行人</div>
        <div slot="remark"
             v-html="executorTxt"></div>
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo', 'file', 'at', 'emoji', 'topic','open']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
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
          formItems: [],
          approvers: '',
          executors: ''
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        approve: 'getCreateObject'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      },
      approverTxt() {
        let aps = this.form.approvers
        return aps.length > 0 ? `${aps.length}位成员` : ''
      },
      executorTxt() {
        let exs = this.form.executors
        return exs.length > 0 ? `${exs.length}位成员` : ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        const that = this
        that.editorMessage.isPrivate = '1'
        if (that.approve.form) {
          that.form = { ...that.approve.form }
          let item = that.approve.formItem
          let itemUsers = that.approve.users
          if (item) {
            let items = that.form.formItems.map(v => {
              if (v.id === item.id) {
                return { ...item, users: itemUsers || [] }
              }
              return v
            })
            that.form = { ...that.form, formItems: JSON.parse(JSON.stringify(items)) }
            that.modifyCreateObjectField('formItem')
            that.modifyCreateObjectField('users')
          }
          let apvs = that.approve.approvers
          if (Check.isRealArray(apvs)) {
            that.form = { ...that.form, approvers: apvs }
            that.setCreateObject({ approvers: [] })
          }
          let exts = that.approve.executors
          if (Check.isRealArray(exts)) {
            that.form = { ...that.form, executors: exts }
            that.setCreateObject({ executors: [] })
          }
          let tp = that.approve.formType
          if (Check.isObject(tp)) {
            let items = []
            if (tp.approveProjects) {
              tp.approveProjects.map(v => {
                if (v.type === '3') {
                  items.push({ ...v, ...{ users: [] } })
                } else {
                  items.push({ ...v, ...{ content: '' } })
                }
              })
            }
            let apvs = []
            let exts = []
            if (tp.approveFromPersons) {
              apvs = tp.approveFromPersons.filter(v => {
                return v.type === 'to'
              })
              exts = tp.approveFromPersons.filter(v => {
                return v.type === 'executor'
              })
            }
            that.form = { ...that.form, type: tp, formItems: items, approvers: apvs, executors: exts }
            that.modifyCreateObjectField('formType')
          }
          that.setCreateObject({ form: that.form })
        }
      },
      memberTxt(item) {
        return Check.isRealArray(item.users) ? `${item.users.length}位成员` : ''
      },
      handleType() {
        this.setCreateObject({ form: this.form, formType: this.form.type })
        this.routePush({ name: 'selectFormType1001' })
      },
      handleItem(item) {
        this.setCreateObject({ form: this.form, formItem: item, options: item.options })
        this.routePush({ name: 'selectOption1001', query: { title: item.name } })
      },
      handleMember(item) {
        this.setCreateObject({ form: this.form, formItem: item, users: item.users })
        this.routePush({ name: 'selectMember1001' })
      },
      handleApprover() {
        this.setCreateObject({ form: this.form, isApprover: true, approvers: this.form.approvers, users: [] })
        this.routePush({ name: 'selectHandler1001' })
      },
      handleExecutor() {
        this.setCreateObject({ form: this.form, isApprover: false, executors: this.form.executors, users: [] })
        this.routePush({ name: 'selectHandler1001' })
      },
      handleSubmit() {
        const that = this

        let form = this.form
        if (!form.type) {
          that.$message({ message: '请选择表单', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.approvers)) {
          that.$message({ message: '审批人不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.executors)) {
          that.$message({ message: '执行人不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '审批内容不能为空', type: 'warning' })
          return false
        }

        let items = []
        form.formItems.map(v => {
          let op = {
            name: v.name,
            type: v.type,
            content: ''
          }
          if (v.type === '4') {
            op.content = v.content ? DateUtils.format_0800(v.content) : ''
          } else if (v.type === '5') {
            let date = DateUtils.format(new Date(), DateUtils.YMD)
            op.content = v.content ? DateUtils.format_0800(`${date} ${v.content}`) : ''
          } else if (v.type === '3' && Check.isRealArray(v.users)) {
            op.content = JSON.stringify(
              v.users.map(u => {
                return {
                  userId: u.userId,
                  name: u.name,
                  avatar: u.avatar
                }
              })
            )
          } else {
            op.content = v.content
            if (v.optionId) {
              op.optionId = v.optionId
            }
          }
          items.push(op)
        })

        let apvs = form.approvers.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'to',
            sort: v.approveOrder
          }
        })

        let exts = form.executors.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            status: '1',
            avatar: v.avatar ? v.avatar : null,
            userType: v.userType,
            type: 'executor',
            sort: v.approveOrder
          }
        })
        let users = this.editorMessage.toUsers || []
        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1001',
          groupId: that.currentGroup.groupId,
          categoryId: form.type.id,
          categoryName: form.type.name,
          msgJson: JSON.stringify({
            name: form.type.name,
            fromId: form.type.id,
            approveContents: items
          }),
          msgType: '1',
          toUsers: [...apvs, ...exts, ...users]
        })
        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.setCreateObject({})
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
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .approve-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .apv-time input {
      min-width: initial !important;
    }
  }
</style>
