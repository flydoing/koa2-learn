<template>
  <Page title="新建发货"
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
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item label="发票类型"
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
    <item label="发票抬头"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.payable" />
    </item>
    <item label="发票金额"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.amount" />
    </item>
    <item label="寄送地址"
          @click="handleReceive"
          :remark="receiveTxt">
    </item>
    <TextInput v-model="form.content"
               placeholder="发票内容"></TextInput>
    <div class="category-title"></div>
    <item label="开票人"
          @click="handlePerson"
          :remark="personTxt"></item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import Api1065 from '@/views/business/1065/api'
  import Api1062 from '@/views/business/1062/api'
  import CategoryApi from '@/api/category'
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
          person: null,
          receive: null,
          amount: '',
          payable: '',
          type: null,
          content: ''
        },
        types: []
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
        let contract = this.form.contract
        return contract ? `${contract.name} （金额：${contract.amount} 元）` : '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      },
      typeTxt() {
        let tp = this.form.type || {}
        return tp.name || '必填'
      },
      receiveTxt() {
        let receive = this.form.receive || {}
        return receive.addressee ? `${receive.addressee}，${receive.mobile}` : '必填'
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
          if (this.crm.receive) {
            this.form.receive = this.crm.receive
            this.deleteCrmProp('receive')
          }
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          this.deleteCrmProp('form')
        }
        CategoryApi.getCategorysByType('68').then(res => {
          this.types = res.categorys || []
        })
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
            Api1065.getPaybackContracts(form.customer.id, '1104').then(res => {
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
      handleType(item) {
        this.form.type = item
      },
      handleReceive() {
        this.setCrm({ form: this.form, receive: this.form.receive })
        this.routePush({ name: 'receiveInfo1105' })
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
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }
        if (!form.contract) {
          that.$message({ message: '合同不能为空', type: 'warning' })
          return false
        }
        if (!form.type) {
          that.$message({ message: '发票类型不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.payable)) {
          that.$message({ message: '发票抬头不能为空', type: 'warning' })
          return false
        }
        if (!Check.isNumber(form.amount) || form.amount < 1) {
          that.$message({ message: '请输入发票金额', type: 'warning' })
          return false
        }
        if (form.amount > form.contract.amount) {
          that.$message({ message: '发票金额不能大于合同总金额', type: 'warning' })
          return false
        }
        if (!form.receive) {
          that.$message({ message: '寄送地址不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '开票人不能为空', type: 'warning' })
          return false
        }

        let person = form.person
        let receive = form.receive
        let areas = []
        if (Check.isRealArray(receive.selectAreas)) {
          areas = receive.selectAreas.map(v => {
            return receive.area[v].label
          })
        }

        let postData = that.constructionMessage({
          type: '1102',
          groupId: that.groupId,
          content: form.content,
          msgJson: JSON.stringify({
            invoice: {
              clientId: form.customer.id,
              clientName: form.customer.name,
              contractId: form.contract.id,
              contractName: form.contract.name,
              categoryId: form.type.id,
              amount: form.amount,
              title: form.payable,
              express: {
                name: form.addressee,
                phone: form.mobile,
                area: areas.join(' '),
                address: form.address
              }
            }
          }),
          toUsers: [
            {
              userId: person.userId,
              name: person.name,
              status: '1',
              avatar: person.avatar,
              userType: person.userType,
              type: 'to'
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
<style lang="scss">
  .vx-item {
    .es-address {
      line-height: rem(45) !important;
      .el-cascader__label {
        text-align: right !important;
        padding-right: 0;
      }
      .el-input__suffix {
        display: none;
      }
    }
    .el-input input {
      padding-right: 0;
    }
  }
</style>
