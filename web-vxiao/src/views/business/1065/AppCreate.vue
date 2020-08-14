<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <div class="contract-create">
      <item label="合同名称"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item label="客户"
            @click="handleCustomer"
            :remark="customerTxt"></item>
      <item label="代理商"
            @click="handleAgent"
            :remark="agentTxt"></item>
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
      <item label="相关合同"
            v-if="showContract"
            @click="handleContract"
            :remark="contractTxt"></item>
      <item label="相关项目"
            @click="handleProject"
            :remark="projectTxt"></item>
      <item label="合同负责人"
            @click="handlePerson"
            :remark="personTxt"></item>
      <item label="合同审核人"
            @click="handleApprover"
            :remark="approverTxt"></item>
      <div class="category-title"></div>
      <item label="合同金额"
            :hasClick="false"
            :remark="totalTxt"></item>
      <template v-for="(item, i) in form.products">
        <item v-if="item.status !== 'd'"
              :key="i"
              :label="item.productName"
              :remark="amountTxt(item)"
              @click="handleProduct(item)">
        </item>
      </template>
      <item @click="handleAddProduct"
            label="新增产品"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
      </item>
      <div class="category-title"></div>
      <item :hasClick="false"
            label="合同签署日">
        <div slot="remark">
          <el-date-picker v-model="form.signDate"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false"
            label="发货计划">
        <div slot="remark">
          <el-date-picker v-model="form.planDate"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false"
            label="合同到期日">
        <div slot="remark">
          <el-date-picker v-model="form.endDate"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="必填"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item label="若新增年服务费"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.fee" />
        <div slot="after">元/年</div>
      </item>
      <div class="category-title text">支付</div>
      <template v-for="(item, i) in form.pays">
        <item v-if="item.status !== 'd'"
              :key="i"
              :label="item.date"
              :remark="paymentTxt(item)"></item>
      </template>
      <item @click="handleAddPay"
            label="付款时间"
            remark="金额"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
      </item>
      <div class="catgory-title"></div>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      :toolbars="['photo']" />
      </keep-alive>
      <div class="category-title"></div>
      <item label="修改记录"
            v-if="form.modifyCount"
            @click="handleModifyRecord">
        <div slot="remark">{{form.modifyCount}}次</div>
      </item>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import Api1079 from '@/views/business/1079/api'
  import Api1085 from '@/views/business/1085/api'
  import DateUtils from '@/utils/date'
  import Api1062 from '@/views/business/1062/api'
  import Api from './api'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          person: null, // 负责人
          agent: null, // 代理商
          customer: null, // 客户
          project: null, // 项目
          contract: null, // 合同
          type: null, // 类型
          approver: '', // 审核人
          signDate: '', // 合同签署日
          planDate: '', // 发货计划
          endDate: null, // 合同到期日
          products: [], // 产品
          pays: [], // 支付方式
          fee: '', // 服务费
          removeUser: null
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
      title() {
        return this.routeQuery('msgId') ? '编辑合同' : '新建合同'
      },
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || '必填'
      },
      agentTxt() {
        let agent = this.form.agent || {}
        return agent.name || '选填'
      },
      showContract() {
        let type = this.form.type || {}
        return type.value === '2'
      },
      projectTxt() {
        let project = this.form.project || {}
        return project.name || '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      },
      approverTxt() {
        let approver = this.form.approver || {}
        return approver.name || '必填'
      },
      contractTxt() {
        let contract = this.form.contract || {}
        return contract.name || '必填'
      },
      typeTxt() {
        let type = this.form.type || {}
        return type.name || '必填'
      },
      totalTxt() {
        let _total = 0
        this.form.products.forEach(v => {
          if (v.amount) {
            _total += parseFloat(v.amount)
          }
        })
        return `${_total.toFixed(2)}元`
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyMessage']),
      amountTxt(item) {
        if (item.num) {
          return `${item.num}${item.unit}，${item.amount}元`
        }
        return ''
      },
      paymentTxt(item) {
        return `${item.amount}元`
      },
      fetchData() {
        let msgId = this.routeQuery('msgId')
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
          let project = this.getStorage('_crm_business_project_cache')
          this.form.project = project || this.form.project
          let contract = this.getStorage('_crm_business_contract_cache')
          this.form.contract = contract || this.form.contract
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          let approver = this.getStorage('_crm_business_approver_cache')
          if (approver) {
            if (msgId) {
              let user = this.form.approver || {}
              if (approver.userId !== user.userId) {
                if (user.msgId) {
                  this.form.removeUser = user
                }
              }
            }
            this.form.approver = approver
          }
          this.form.approver = approver || this.form.approver
          if (this.crm.products) {
            this.form.products.push(...this.crm.products)
            this.deleteCrmProp('products')
          }
          let product = this.crm.product
          if (product) {
            if (product.status === 'd' && !product.id) {
              this.form.products = this.form.products.filter(v => {
                return v.productId !== product.productId
              })
            } else {
              this.form.products = this.form.products.map(v => {
                if (v.productId === product.productId) {
                  return product
                }
                return v
              })
            }
            this.deleteCrmProp('product')
          }
          let pay = this.crm.pay
          if (pay) {
            if (pay.status === 'd' && !pay.id) {
              this.form.pays = this.form.pays.filter(v => {
                return v.serial !== pay.serial
              })
            } else if (pay.id || pay.serial) {
              this.form.pays = this.form.pays.map(v => {
                if ((pay.id && v.id === pay.id) || (pay.serial && v.serial === pay.serial)) {
                  return pay
                }
                return v
              })
            } else {
              this.form.pays.push({ ...pay, serial: Math.random(1, 999) })
            }
            this.deleteCrmProp('pay')
          }
        } else if (msgId) {
          MessageApi.getMessageById(msgId).then(res => {
            if (res.message) {
              let ms = res.message
              let mJson = JSON.parse(ms.msgJson || '{}')
              this.form = {
                ...this.form,
                id: mJson.id || void 0,
                userId: ms.fromUserId,
                name: mJson.name,
                fee: mJson.annualServiceFee || '',
                products: mJson.products || [],
                signDate: DateUtils.format(mJson.startDate, 'yyyy-MM-dd'), // 合同签署日
                planDate: DateUtils.format(mJson.deliveryDate, 'yyyy-MM-dd'), // 发货计划
                endDate: DateUtils.format(mJson.dueDate, 'yyyy-MM-dd'), // 合同到期日
                modifyCount: mJson.modifyCount || 0
              }
              if (mJson.type) {
                this.form.type = {
                  name: mJson.typeName,
                  value: mJson.type
                }
              }
              if (mJson.clientId) {
                this.form.customer = {
                  id: mJson.clientId,
                  name: mJson.clientName
                }
              }
              if (mJson.agentId) {
                this.form.agent = {
                  id: mJson.agentId,
                  name: mJson.agentName
                }
              }
              if (mJson.relations) {
                this.form.person = mJson.relations[0]
              }
              if (mJson.renewContractId) {
                this.form.contract = {
                  id: mJson.renewContractId,
                  name: mJson.renewContractName
                }
              }
              if (mJson.projectId) {
                this.form.project = {
                  id: mJson.projectId,
                  name: mJson.projectName
                }
              }
              if (mJson.payments) {
                this.form.pays = mJson.payments.map(v => {
                  return {
                    id: v.id,
                    date: DateUtils.format(v.payTime, 'yyyy-MM-dd'),
                    amount: v.money
                  }
                })
              }
              if (ms.toUsers) {
                this.form.approver = ms.toUsers.filter(v => {
                  return v.type === 'executor'
                })[0]
              }
              this.editorMessage = {
                content: mJson.remark,
                medias: ms.medias
              }
            }
          })
        }

        CategoryApi.getCategorysByType('99').then(res => {
          this.types = res.categorys || []
        })

        if (this.crm.params) {
          this.deleteCrmProp('params')
        }
      },
      handleType(item) {
        this.form.type = item
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
        let params = {
          property: 'contract',
          getListData: function(callback) {
            Api.getContracts().then(res => {
              callback(res.contracts || [])
            })
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '相关合同'
          }
        })
      },
      handleProject() {
        const that = this
        if (!that.form.customer) {
          that.$message({ message: '请选择客户', type: 'warning' })
          return false
        }
        let params = {
          property: 'project',
          getListData: function(callback) {
            Api1085.getProjects({ clientId: that.form.customer.id }).then(res => {
              callback(res.projects || [])
            })
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '相关项目'
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
      handleProduct(item) {
        this.setCrm({ form: this.form, product: item, editAble: true })
        this.routePush({ path: '/vx/group/business/1065/productInfo' })
      },
      handleAddProduct() {
        this.setCrm({ form: this.form, products: this.form.products })
        this.routePush({ path: '/vx/group/business/1065/selectProduct' })
      },
      handlePay(item) {
        this.setCrm({ form: this.form, pay: item, editAble: true })
        this.routePush({ path: '/vx/group/business/1065/payInfo' })
      },
      handleAddPay() {
        this.setCrm({ form: this.form, editAble: true })
        this.routePush({ path: '/vx/group/business/1065/payInfo' })
      },
      handlePerson() {
        let params = {
          property: 'person',
          users: this.form.person ? [this.form.person] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleApprover() {
        let params = {
          property: 'approver',
          users: this.form.approver ? [this.form.approver] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '合同名称不能为空', type: 'warning' })
          return false
        }
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }
        if (!form.type) {
          that.$message({ message: '类型不能为空', type: 'warning' })
          return false
        }

        if (form.type.value === '2' && !form.contract) {
          that.$message({ message: '相关合同不能为空', type: 'warning' })
          return false
        }
        if (!form.project) {
          that.$message({ message: '相关项目不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '合同负责人不能为空', type: 'warning' })
          return false
        }
        if (!form.approver) {
          that.$message({ message: '合同审核人不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.products)) {
          that.$message({ message: '产品不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.signDate)) {
          that.$message({ message: '合同签署日不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.planDate)) {
          that.$message({ message: '发货计划不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.endDate)) {
          that.$message({ message: '合同到期日不能为空', type: 'warning' })
          return false
        }
        if (new Date(form.endDate).getTime() < new Date(form.signDate).getTime()) {
          that.$message({ message: '合同签署日不能大于合同到期日', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.pays)) {
          that.$message({ message: '付款时间不能为空', type: 'warning' })
          return false
        }

        let flag = false
        let products = []
        form.products.forEach(v => {
          if (Check.isNullString(v.amount)) {
            flag = true
          } else {
            products.push(v)
          }
        })

        if (flag) {
          that.$message({ message: '产品明细存在空值', type: 'warning' })
          return false
        }
        let editor = this.editorMessage
        let mJson = {
          id: form.id || void 0,
          type: form.type.value,
          typeName: form.type.name,
          clientId: form.customer.id,
          clientName: form.customer.name,
          dueDate: DateUtils.format_0800(`${form.endDate} 23:59:59`),
          name: form.name,
          products: products,
          payments: form.pays.map(v => {
            return {
              id: v.id || void 0,
              payTime: DateUtils.format_0800(v.date),
              money: v.amount
            }
          }),
          deliveryDate: DateUtils.format_0800(form.planDate),
          projectId: form.project.id,
          projectName: form.project.name,
          relations: [form.person],
          startDate: DateUtils.format_0800(form.signDate),
          remark: editor.content
        }

        if (form.agent) {
          mJson.agentId = form.agent.id
          mJson.agentName = form.agent.name
        }

        if (form.contract) {
          mJson.renewContractId = form.contract.id
          mJson.renewContractName = form.contract.name
        }

        let msgId = this.routeQuery('msgId')
        if (msgId) {
          mJson.msgId = msgId
        }

        if (form.fee) {
          mJson.annualServiceFee = form.fee
        }

        let postData = this.constructionMessage({
          ...this.editorMessage,
          groupId: this.groupId,
          type: '106501',
          msgJson: JSON.stringify(mJson),
          toUsers: [
            {
              name: form.approver.name,
              status: '1',
              type: 'executor',
              userId: form.approver.userId,
              userType: form.approver.userType
            }
          ],
          status: '3'
        })

        let removeUser = form.removeUser
        if (removeUser && removeUser.userId !== form.approver.userId) {
          postData.toUsers.push({ ...removeUser, status: 'd' })
        }

        if (msgId) {
          postData.id = msgId
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
      handleModifyRecord() {
        this.routePush({
          path: '/vx/group/business/1046/modifyRecord',
          query: { id: this.form.id, appType: '106501' }
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
