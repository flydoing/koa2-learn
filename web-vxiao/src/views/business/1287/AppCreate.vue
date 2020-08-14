<template>
  <Page title="新建开户"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="客户"
          @click="handleCustomer"
          :remark="customerTxt"></item>
    <item label="合同"
          @click="handleContract"
          :remark="contractTxt"></item>
    <div class="category-title"></div>
    <item label="审批人"
          @click="handleApprover"
          :remark="approverTxt"></item>
    <item label="执行人"
          @click="handlePerson"
          :remark="personTxt"></item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import Api1065 from '@/views/business/1065/api'
  import Api1062 from '@/views/business/1062/api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          customer: null,
          contract: null,
          approvers: [],
          person: null
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || '必填'
      },
      contractTxt() {
        let contract = this.form.contract || {}
        return contract.name || '必填'
      },
      approverTxt() {
        let approvers = this.form.approvers
        return approvers.length > 0 ? `${approvers.length}位成员` : '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let customer = this.getStorage('_crm_business_customer_cache')
          this.form.customer = customer || this.form.customer
          let contract = this.getStorage('_crm_business_contract_cache')
          this.form.contract = contract || this.form.contract
          if (this.crm.approvers) {
            this.form.approvers = this.crm.approvers
            this.deleteCrmProp('approvers')
          }
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          this.deleteCrmProp('form')
        }
      },
      handleCustomer() {
        const that = this
        let params = {
          property: 'customer',
          getListData: function(callback) {
            Api1062.getCustomers(that.groupId).then(res => {
              callback(res.clients || [])
            })
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '客户'
          }
        })
      },
      handleContract() {
        let form = this.form
        if (!form.customer) {
          this.$message({ message: '请选择客户', type: 'warning' })
          return false
        }
        let params = {
          property: 'contract',
          field: 'extension',
          getListData: function(callback) {
            Api1065.getPaybackContracts(form.customer.id).then(res => {
              callback(res.datas || [])
            })
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '选择合同'
          }
        })
      },
      handleApprover() {
        this.setCrm({ form: this.form, approvers: this.form.approvers })
        this.routePush({ path: '/vx/group/business/1287/selectHandler' })
      },
      handlePerson() {
        let params = {
          property: 'person',
          users: this.form.person ? [this.form.person] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }
        if (!form.contract) {
          that.$message({ message: '合同不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.approvers)) {
          that.$message({ message: '审批人不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '执行人不能为空', type: 'warning' })
          return false
        }

        let person = form.person
        let postData = that.constructionMessage({
          ...editor,
          type: '1287',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            clientId: form.customer.id,
            clientName: form.customer.name,
            contractId: form.contract.id,
            contractName: form.contract.name
          }),
          toUsers: [
            ...form.approvers,
            {
              userId: person.userId,
              name: person.name,
              avatar: person.avatar,
              userType: person.userType,
              type: 'executor'
            }
          ]
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
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
