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
    <item label="代理商"
          @click="handleAgent"
          :remark="agentTxt"></item>
    <item label="合同"
          @click="handleContract"
          :remark="contractTxt"></item>
    <item label="回款"
          :hasClick="false"
          :remark="amountTxt">
      <div slot="after">元</div>
    </item>
    <div class="category-title"></div>
    <item label="审批人"
          @click="handleApprover"
          :remark="approverTxt"></item>
    <item label="发货人"
          @click="handlePerson"
          :remark="personTxt"></item>
    <template v-if="hasProduct">
      <div class="category-title text">发货数量</div>
      <item v-for="(item, i) in form.contract.products"
            :key="i"
            :label="item.productName"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="item.value"
               @keyup="handleNumber(item)" />
        <div slot="after"
             v-html="item.unit"></div>
      </item>
    </template>

    <div class="category-title"></div>
    <item :hasClick="false"
          label="收件人">
      <input slot="remark"
             placeholder="姓名"
             v-model="form.addressee" />
    </item>
    <item :hasClick="false"
          label="手机号码">
      <input slot="remark"
             placeholder="11位手机号"
             v-model="form.mobile" />
    </item>
    <item :hasClick="false"
          label="地区">
      <div slot="remark">
        <el-cascader class="es-address"
                     :options="form.provinces"
                     v-model="form.selectAreas"
                     @active-item-change="handleAddress"></el-cascader>
      </div>
    </item>
    <item :hasClick="false"
          label="详细信息">
      <input slot="remark"
             placeholder="街道门牌信息"
             v-model="form.address" />
    </item>
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
  import Api1079 from '@/views/business/1079/api'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          customer: null,
          agent: null,
          contract: null,
          approver: null,
          person: null,
          addressee: '',
          mobile: '',
          address: '',
          area: {},
          provinces: [],
          selectAreas: []
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
      hasProduct() {
        let contract = this.form.contract || {}
        let products = contract.products || []
        return products.length > 0
      },
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || '必填'
      },
      agentTxt() {
        let agent = this.form.agent || {}
        return agent.name || '选填'
      },
      contractTxt() {
        let contract = this.form.contract || {}
        return contract.name || '必填'
      },
      approverTxt() {
        let approver = this.form.approver || {}
        return approver.name || '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      },
      amountTxt() {
        let contract = this.form.contract
        if (contract) {
          return `${contract.value || 0}/${contract.amount}元`
        }
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyMessage']),
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let customer = this.getStorage('_crm_business_customer_cache')
          if (customer) {
            this.form.customer = customer
            let meta = (customer.metaDatas || []).filter(v => {
              return v.metaType === 'm_client_agent'
            })[0]
            if (meta) {
              this.form.agent = { id: meta.userId, name: meta.obj }
            }
          }
          let agent = this.getStorage('_crm_business_agent_cache')
          this.form.agent = agent || this.form.agent
          let contract = this.getStorage('_crm_business_contract_cache')
          if (contract) {
            if (Check.isRealArray(contract.products)) {
              contract.products = contract.products.map(v => {
                return { ...v, value: v.num }
              })
            }
            this.form.contract = contract
          }
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          let approver = this.getStorage('_crm_business_approver_cache')
          this.form.approver = approver || this.form.approver
          this.deleteCrmProp('form')
        } else {
          GroupApi.getProvinces().then(res => {
            this.form.provinces = res.provinces.map(v => {
              if (v.province.indexOf('市') !== -1) {
                v = { ...v, label: v.province, value: v.provinceId }
                this.form.area[v.provinceId] = v
              } else {
                v = { ...v, label: v.province, value: v.provinceId, children: [] }
                this.form.area[v.provinceId] = v
              }
              return v
            })
          })
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
      handleAgent() {
        const that = this
        let params = {
          property: 'agent',
          getListData: callback => {
            Api1079.getAgents(that.groupId).then(res => {
              callback(res.datas || [])
            })
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '代理商'
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
      handleApprover() {
        let params = {
          property: 'approver',
          users: this.form.approver ? [this.form.approver] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handlePerson() {
        let params = {
          property: 'person',
          users: this.form.person ? [this.form.person] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleNumber(item) {
        if (item.value > item.num || item.value < 1) {
          this.$set(item, 'number', item.num)
        }
      },
      handleAddress(ads) {
        const that = this
        let pv = that.form.area[ads[0]]
        if (Check.isRealArray(pv.children)) {
          that.form.provinces = that.form.provinces.map(v => {
            if (v.value === parseInt(ads[0])) {
              v.children = pv.children
            }
            return v
          })
        } else {
          GroupApi.getCities(ads[0]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === parseInt(ads[0]) && res.citys) {
                v.children = res.citys.map(c => {
                  c = { ...c, label: c.city, value: c.cityId }
                  that.form.area[c.cityId] = c
                  return c
                })
                pv.children = v.children
              }
              return v
            })
          })
        }
        that.form.selectAreas = ads
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }
        if (!form.agent) {
          that.$message({ message: '代理商不能为空', type: 'warning' })
          return false
        }
        if (!form.contract) {
          that.$message({ message: '合同不能为空', type: 'warning' })
          return false
        }
        if (!form.approver) {
          that.$message({ message: '审批人不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '发货人不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.addressee)) {
          that.$message({ message: '收件人不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.mobile)) {
          that.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }

        let person = form.person
        let approver = form.approver
        let areas = []
        if (Check.isRealArray(form.selectAreas)) {
          areas = form.selectAreas.map(v => {
            return form.area[v].label
          })
        }
        let postData = that.constructionMessage({
          ...editor,
          type: '1104',
          groupId: that.groupId,
          status: '3',
          msgJson: JSON.stringify({
            delivery: {
              clientId: form.customer.id,
              clientName: form.customer.name,
              agentId: form.agent.id,
              agentName: form.agent.name,
              contractId: form.contract.id,
              contractName: form.contract.name,
              backAmount: form.contract.value,
              totalAmount: form.contract.amount,
              products: form.contract.products.map(v => {
                return {
                  productId: v.productId,
                  productName: v.productName,
                  useNum: v.value,
                  num: v.num,
                  unit: v.unit || '',
                  amount: v.amount || 0,
                  price: v.price || 0
                }
              }),
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
              userId: approver.userId,
              name: approver.name,
              status: '1',
              avatar: approver.avatar,
              userType: approver.userType,
              type: 'to'
            },
            {
              userId: person.userId,
              name: person.name,
              status: '1',
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
