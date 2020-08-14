<template>
  <Page title="合同详情">
    <label slot="btn"
           v-if="editAble"
           @click="handleEdit">编辑</label>
    <div class="contract-detail">
      <item label="合同名称"
            :hasClick="false"
            :remark="form.name">
      </item>
      <item label="客户"
            @click="handleCustomer"
            :remark="customerTxt"></item>
      <item label="代理商"
            @click="handleAgent"
            :remark="agentTxt"></item>
      <item label="类型"
            :hasClick="false"
            :remark="typeTxt"></item>
      <item label="相关合同"
            v-if="showContract"
            @click="handleContract"
            :remark="contractTxt"></item>
      <item label="相关项目"
            @click="handleProject"
            :remark="projectTxt"></item>
      <item label="合同负责人"
            :hasClick="false"
            :remark="personTxt"></item>
      <item label="合同审核人"
            :hasClick="false"
            :remark="approverTxt"></item>
      <div class="category-title"></div>
      <item label="合同金额"
            :hasClick="false"
            :remark="totalTxt"></item>
      <item v-for="(item, i) in form.products"
            :key="i"
            :label="item.productName"
            :remark="amountTxt(item)"
            @click="handleProduct(item)">
      </item>
      <div class="category-title"></div>
      <item :hasClick="false"
            label="合同签署日"
            :remark="form.signDate">
      </item>
      <item :hasClick="false"
            label="发货计划"
            :remark="form.planDate">
      </item>
      <item :hasClick="false"
            label="合同到期日"
            :remark="form.endDate">
      </item>
      <item label="若新增年服务费"
            :hasClick="false"
            :remark="form.fee">
        <div slot="after">元/年</div>
      </item>
      <template v-if="form.pays.length > 0">
        <div class="category-title text">支付</div>
        <item v-for="(item, i) in form.pays"
              :key="i"
              :label="item.date"
              :remark="paymentTxt(item)"
              @click="handlePay(item)"></item>
      </template>
      <div class="category-title"></div>
      <div class="remark-txt"
           v-if="editorMessage.content"
           v-html="editorMessage.content"></div>
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
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'
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
          fee: '' // 服务费
        },
        types: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      editAble() {
        if (this.routeQuery('msgId')) {
          return (this.form.fromUserId === this.userId || this.isAdmin) && this.form.status === '3'
        }
        return false
      },
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || ''
      },
      agentTxt() {
        let agent = this.form.agent || {}
        return agent.name || ''
      },
      showContract() {
        let type = this.form.type || {}
        return type.value === '2'
      },
      projectTxt() {
        let project = this.form.project || {}
        return project.name || ''
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || ''
      },
      approverTxt() {
        let approver = this.form.approver || {}
        return approver.name || ''
      },
      contractTxt() {
        let contract = this.form.contract || {}
        return contract.name || ''
      },
      typeTxt() {
        let type = this.form.type || {}
        return type.name || ''
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
        if (msgId) {
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
                modifyCount: mJson.modifyCount || 0,
                status: ms.status
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
      handleCustomer() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1062',
            groupId: this.groupId,
            cid: this.form.customer.id
          }
        })
      },
      handleContract() {
        this.routePush({
          path: '/vx/group/business/1065/detail',
          query: {
            msgId: this.form.contract.id
          }
        })
      },
      handleProject() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1085',
            groupId: this.groupId,
            pid: this.form.project.id
          }
        })
      },
      handleAgent() {
        this.routePush({
          path: '/vx/group/business/1079/detail',
          query: {
            aid: this.form.agent.id
          }
        })
      },
      handleProduct(item) {
        this.setCrm({ product: item, editAble: false })
        this.routePush({ path: '/vx/group/business/1065/productInfo' })
      },
      handlePay(item) {
        this.setCrm({ pay: item, editAble: false })
        this.routePush({ path: '/vx/group/business/1065/payInfo' })
      },
      handleEdit() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '106501',
            groupId: this.groupId,
            msgId: this.routeQuery('msgId')
          }
        })
      },
      handleModifyRecord() {
        this.routePush({
          path: '/vx/group/business/1046/modifyRecord',
          query: { id: this.form.id, appType: '106501' }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .contract-detail {
    .remark-txt {
      padding: rem(10);
    }
  }
</style>
