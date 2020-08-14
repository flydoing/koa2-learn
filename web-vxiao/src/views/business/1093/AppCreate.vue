<template>
  <Page title="新建计划"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleMonth">
      <div class="el-dropdown-link">
        <item label="月份"
              :remark="form.month"></item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(m, i) in monthes"
                          :key="i"
                          :command="m">m</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item label="负责人"
          @click="handlePerson"
          :remark="personTxt"></item>
    <div class="category-title"></div>
    <item label="相关项目"
          @click="handleProject"
          :remark="projectTxt"></item>
    <item label="合同数量"
          :hasClick="false"
          :remark="form.ctNumber">
      <div slot="after">份</div>
    </item>
    <item label="合同金额"
          :hasClick="false"
          :remark="form.ctAmount">
      <div slot="after">元</div>
    </item>
    <item label="回款金额"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.backAmount" />
      <div slot="after">元</div>
    </item>
    <item label="新增项目"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.pNumber" />
      <div slot="after">个</div>
    </item>
    <div class="category-title"></div>
    <item label="新增客户"
          :hasClick="false"
          :remark="form.cNumber">
      <div slot="after">个</div>
    </item>
    <item label="新增代理商"
          :hasClick="false"
          :remark="form.aNumber">
      <div slot="after">个</div>
    </item>
    <item label="客户拜访"
          :hasClick="false"
          :remark="form.cvCount">
      <div slot="after">次</div>
    </item>
    <item label="代理商拜访"
          :hasClick="false"
          :remark="form.avCount">
      <div slot="after">次</div>
    </item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import DateUtils from '@/utils/date'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import MessageApi from '@/api/message'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          month: '',
          person: null,
          projects: [],
          ctNumber: '',
          ctAmount: '',
          backAmount: '',
          pNumber: '5',
          cNumber: '8',
          aNumber: '15',
          cvCount: '15',
          avCount: '15'
        },
        monthes: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      projectTxt() {
        let projects = this.form.projects
        if (projects.length > 0) {
          return `${projects.length}个`
        }
        return '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || (this.canEdit ? '必填' : '')
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyMessage']),
      fetchData() {
        let msgId = this.routeQuery('msgId')
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let person = this.getStorage('_crm_business_person_cache')
          if (person) {
            Api.checkWetherExistPlan(this.groupId, person.userId, this.form.month).then(res => {
              this.form.person = person
            })
          }
          if (this.crm.projects) {
            this.form.projects = this.crm.projects
            let ctNumber = 0
            let ctAmount = 0
            this.form.projects.forEach(v => {
              ctAmount += v.expectTotalAmount
              ctNumber += v.contractNum
            })
            this.form.ctNumber = ctNumber
            this.form.ctAmount = ctAmount
            this.form.backAmount = ctAmount
            this.deleteCrmProp('projects')
          }
          this.deleteCrmProp('form')
        } else if (msgId) {
          MessageApi.getMessageById(msgId).then(res => {
            if (res.message) {
              let mJson = JSON.parse(res.message.msgJson || '{}')
              this.form = {
                month: DateUtils.format(mJson.month || new Date(), 'yyyy-MM'),
                person: this.getRelationById(this.groupId, mJson.userId),
                ctNumber: mJson.contractCount || '',
                ctAmount: mJson.goalAmount || '',
                backAmount: mJson.backpayAmount || '',
                pNumber: mJson.signProjectCount || '5',
                cNumber: mJson.addClientCount || '8',
                aNumber: mJson.addAgentCount || '15',
                cvCount: mJson.visitClientCount || '15',
                avCount: mJson.visitAgentCount || '15'
              }
              if (mJson.projects) {
                this.form.projects = mJson.projects.map(v => {
                  return {
                    id: v.projectId,
                    name: v.projectName,
                    description: v.description
                  }
                })
              }
            }
          })
        } else {
          this.form.month = DateUtils.format(new Date(), 'yyyy-MM')
          this.form.person = this.getRelationById(this.groupId, this.userId)
        }
        let monthes = []
        let date = new Date()
        for (let i = 0; i < 12; i++) {
          monthes.push(DateUtils.format(new Date(new Date().setMonth(date.getMonth() + i)), 'yyyy-MM'))
        }
        this.monthes = monthes
      },
      handleMonth(month) {
        Api.checkWetherExistPlan(this.groupId, this.form.person.userId, month).then(res => {
          this.form.month = month
        })
      },
      handlePerson() {
        let params = {
          property: 'person',
          users: this.form.person ? [this.form.person] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleProject() {
        this.setCrm({ form: this.form, projects: this.form.projects })
        this.routePush({ name: 'selectProject1093' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (!Check.isRealArray(form.projects)) {
          that.$message({ message: '相关项目不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.backAmount)) {
          that.$message({ message: '回款金额不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.pNumber)) {
          that.$message({ message: '新建项目数量不能为空', type: 'warning' })
          return false
        }

        let mJson = {
          month: DateUtils.format_0800(form.month),
          signProjectCount: form.pNumber,
          contractCount: form.ctNumber,
          addAgentCount: form.aNumber,
          addClientCount: form.cNumber,
          backpayAmount: form.backAmount,
          goalAmount: form.ctAmount,
          visitAgentCount: form.avCount,
          visitClientCount: form.cvCount,
          projects: form.projects.map(v => {
            return {
              projectId: v.id,
              projectName: v.name,
              description: v.description
            }
          })
        }

        let person = form.person
        let postData = that.constructionMessage({
          type: '1093',
          groupId: that.groupId,
          msgJson: JSON.stringify({ plan: mJson }),
          toUsers: [
            {
              avatar: person.avatar,
              name: person.name,
              type: 'to',
              userId: person.userId,
              userType: person.userType
            }
          ]
        })

        let msgId = this.routeQuery('msgId')
        if (msgId) {
          postData.id = msgId
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        } else {
          Api.checkWetherExistPlan(this.groupId, form.person.userId, form.month).then(res => {
            that.addMessage(postData).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
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
<style lang="scss" scoped>
  .share-create {
    textarea {
      height: rem(100);
      border-bottom: rem(1) solid #ededed;
    }
  }
</style>
