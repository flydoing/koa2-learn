<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="来源"
          @click="handleSource"
          :remark="sourceTxt"></item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item label="类型"
              :remark="typeTxt"></item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(tp,i) in types"
                          :key="i"
                          :command="tp">{{tp.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item label="产品"
          @click="handleApp"
          :remark="appTxt"></item>
    <item label="终端"
          :remark="terminalTxt"
          @click="handleTerminal"></item>
    <template v-if="isAdmin">
      <item label="负责人"
            @click="handlePerson"
            :remark="personTxt"></item>
      <item :hasClick="false"
            label="计划开始">
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false"
            label="计划完成">
        <div slot="after">
          <el-date-picker v-model="form.finishTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
    </template>
    <template v-else>
      <item :hasClick="false"
            label="期待完成">
        <div slot="after">
          <el-date-picker v-model="form.expectTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
    </template>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="输入描述"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic','open']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          type: null,
          source: null,
          app: null,
          terminal: null,
          expectTime: '',
          startTime: '',
          finishTime: '',
          terminals: [],
          persons: [],
          message: null
        },
        types: [],
        terminals: [],
        showTerminal: false
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      isEdit() {
        return this.form.id !== undefined && this.form.id !== 0
      },
      title() {
        return this.isEdit ? '更新进展' : '新建需求工单'
      },
      sourceTxt() {
        let source = this.form.source || {}
        return source.name || '必填'
      },
      appTxt() {
        let app = this.form.app || {}
        return app.name || '必填'
      },
      typeTxt() {
        let tp = this.form.type || {}
        return tp.name || '必填'
      },
      terminalTxt() {
        let terminals = this.form.terminals
        if (Check.isRealArray(terminals)) {
          let ts = terminals.map(v => {
            return v.name
          })
          return ts.join('、')
        }
        return '必填'
      },
      personTxt() {
        let persons = this.form.persons
        if (Check.isRealArray(persons)) {
          let ps = []
          persons.map(v => {
            v.name && ps.push(v.name)
          })
          return ps.length > 0 ? ps.join('、') : '必填'
        }
        return '必填'
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let msgId = this.routeQuery('msgId')
        if (this.obj.form) {
          this.form = JSON.parse(JSON.stringify(this.obj.form))
          if (this.obj.app) {
            let app = this.form.app || {}
            this.form.app = this.obj.app
            if (app.id !== this.obj.app.id) {
              this.getHandlers()
            }
            this.modifyCreateObjectField('app')
          }
          if (this.obj.source) {
            this.form.source = this.obj.source
            this.modifyCreateObjectField('source')
          }
          if (this.obj.terminals) {
            let terminals = this.form.terminals
            this.form.terminals = this.obj.terminals

            let flag = false
            let tMap = new Map()
            if (terminals.length > 0) {
              terminals.forEach(v => {
                tMap.set(v.id, v)
              })
              this.obj.terminals.forEach(v => {
                if (!flag && Check.isNullObject(tMap.get(v.id))) {
                  flag = true
                }
              })
            }
            if (flag || terminals.length !== this.obj.terminals.length) {
              this.getHandlers()
            }
            this.modifyCreateObjectField('terminals')
          }
          if (this.obj.persons) {
            this.form.persons = this.obj.persons
            this.modifyCreateObjectField('persons')
          }
          this.modifyCreateObjectField('form')
        } else if (msgId) {
          MessageApi.getMessageById(msgId).then(res => {
            if (res.message) {
              let m = res.message
              let mJson = JSON.parse(m.msgJson || '{}')
              this.form = {
                ...this.form,
                id: m.id,
                jsonId: mJson.id,
                type: {
                  id: mJson.priorityId,
                  name: mJson.priorityName
                },
                source: {
                  id: mJson.clientId || 0,
                  name: mJson.clientName || '内容需求'
                },
                app: {
                  id: mJson.appCategoryId,
                  name: mJson.appCategoryName,
                  value: mJson.appType
                },
                content: m.content
              }
              if (mJson.clientType) {
                let terminals = []
                let ids = mJson.clientType.split(',')
                let names = mJson.clientTypeName.split('，')
                ids.forEach((v, i) => {
                  terminals.push({ id: v, name: names[i] })
                })
                this.form.terminals = terminals
              }
              if (mJson.expirationTime) {
                this.form.expectTime = DateUtils.format(mJson.expirationTime, 'yyyy-MM-dd')
              }
              if (mJson.commitTime) {
                this.form.finishTime = DateUtils.format(mJson.commitTime, 'yyyy-MM-dd')
              }
              if (mJson.startTime) {
                this.form.startTime = DateUtils.format(mJson.startTime, 'yyyy-MM-dd')
              }
              let editor = {
                content: m.content,
                medias: m.medias || [],
                isPrivate: m.isPrivate
              }
              if (m.toUsers) {
                let users = []
                let handlers = []
                m.toUsers.forEach(v => {
                  if (v.type === 'executor' && v.job) {
                    handlers.push(v)
                  } else if (v.type === 'cc') {
                    users.push(v)
                  }
                })
                editor.toUsers = users
                if (Check.isRealArray(handlers)) {
                  this.form.persons = handlers.map(v => {
                    return {
                      userId: v.userId,
                      name: v.name,
                      type: v.type,
                      userType: v.userType,
                      job: v.job,
                      value: v.value || ''
                    }
                  })
                } else {
                  this.getHandlers()
                }
              }
              this.editorMessage = editor
              this.message = m
            }
          })
        }
        CategoryApi.getCategorysByType('164').then(res => {
          this.types = res.categorys || []
        })
      },
      getHandlers() {
        let app = this.form.app
        let terminals = this.form.terminals
        if (app && terminals.length > 0) {
          let ids = terminals.map(v => {
            return v.id
          })
          Api.getAppUsersV2(this.groupId, app.id, ids.join(',')).then(res => {
            this.form.persons = res.persons || []
          })
        }
      },
      handleSource() {
        this.setCreateObject({ form: this.form })
        this.routePush({ path: '/vx/group/business/1203/SelectSchool' })
      },
      handleApp() {
        this.setCreateObject({ form: this.form, app: this.form.app })
        this.routePush({ path: '/vx/group/business/1203/selectApp' })
      },
      handleTerminal() {
        this.setCreateObject({ form: this.form, terminals: this.form.terminals })
        this.routePush({ path: '/vx/group/business/1203/selectTerminal' })
      },
      handleType(item) {
        this.form.type = item
      },
      handlePerson() {
        this.setCreateObject({ form: this.form, persons: this.form.persons })
        this.routePush({ path: '/vx/group/business/1203/handlers' })
      },
      handleSubmit() {
        const that = this
        let form = that.form
        let editor = that.editorMessage
        if (!form.type) {
          that.$message({ message: '请选择类型', type: 'warning' })
          return false
        }
        if (!form.app) {
          that.$message({ message: '请选择产品', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.terminals)) {
          that.$message({ message: '请选择终端', type: 'warning' })
          return false
        }
        if (!this.isAdmin && Check.isNullString(form.expectTime)) {
          that.$message({ message: '期望完成时间不能为空', type: 'warning' })
          return false
        }

        let users = []
        if (this.isAdmin) {
          let job = ''
          let flag = false
          form.persons.forEach(v => {
            if (!flag && v.userId) {
              users.push({
                userId: v.userId,
                name: v.name,
                type: 'executor',
                userType: v.userType,
                job: v.job,
                value: v.value || ''
              })
            } else {
              job = v.job
              flag = true
            }
          })
          if (flag) {
            that.$message({ message: `${job}未设置负责人`, type: 'warning' })
            return false
          }
          if (Check.isNullString(form.startTime)) {
            that.$message({ message: '计划开始时间不能为空', type: 'warning' })
            return false
          }
          if (Check.isNullString(form.finishTime)) {
            that.$message({ message: '计划完成时间不能为空', type: 'warning' })
            return false
          }
        }

        if (Check.isNullString(editor.content)) {
          that.$message({ message: '描述不能为空', type: 'warning' })
          return false
        }

        let ids = form.terminals.map(v => {
          return v.id
        })
        let mJson = {
          id: form.jsonId || void 0,
          appCategoryId: form.app.id,
          appType: form.app.value,
          clientType: ids.join(','),
          priorityId: form.type.id
        }

        if (form.source) {
          mJson.clientId = form.source.id || void 0
        }

        if (this.isAdmin) {
          mJson.startTime = DateUtils.format_0800(form.startTime)
          mJson.commitTime = DateUtils.format_0800(form.finishTime)
        } else {
          mJson.expirationTime = DateUtils.format_0800(form.expectTime)
        }

        if (form.message) {
          let uMap = new Map()
          form.message.toUsers.forEach(v => {
            if (v.type === 'executor') {
              uMap.set(v.userId, v)
            }
          })
          if (users.length > 0) {
            users = users.map(v => {
              let user = uMap.get(v.userId) || {}
              return { ...v, id: user.id || void 0 }
            })
          }
        }

        let postData = that.constructionMessage({
          ...editor,
          id: form.id || void 0,
          type: '1203',
          groupId: that.groupId,
          msgJson: JSON.stringify(mJson),
          version: 2,
          toUsers: [...(editor.toUsers || []), ...users]
        })
        if (this.routeQuery('arrange')) {
          postData.status = '4'
        }

        if (form.id) {
          postData.msgType = 'update'
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        } else {
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        }
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
