<template>
  <Page :title="title"
        closePrompt
        :hasSubmit="canEdit"
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <div class="customer-create">
      <item label="项目名称"
            :hasClick="false">
        <template v-if="canEdit">
          <input slot="remark"
                 placeholder="必填"
                 v-model="form.name" />
        </template>
        <template v-else>
          <div slot="remark"
               v-html="form.name"></div>
        </template>
      </item>
      <item label="负责人"
            @click="handlePerson"
            :hasClick="canEdit"
            :remark="personTxt"></item>
      <item label="客户"
            @click="handleCustomer"
            :hasClick="canEdit || (!canEdit && form.customer !== null)"
            :remark="customerTxt"></item>
      <item label="代理商"
            @click="handleAgent"
            :hasClick="canEdit || (!canEdit && form.agent !== null)"
            :remark="agentTxt"></item>
      <Item label="金额预测"
            :remark="amountTxt"
            :hasClick="canEdit"
            @click="handleAmount">
      </Item>
      <item :hasClick="false"
            label="时间预测">
        <template v-if="canEdit">
          <div slot="after">
            <el-date-picker v-model="form.time"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="必填"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"></el-date-picker>
          </div>
        </template>
        <template v-else>
          <div slot="remark"
               v-html="form.time"></div>
        </template>
      </item>
      <item :hasClick="false"
            label="发货计划">
        <template v-if="canEdit">
          <div slot="after">
            <el-date-picker v-model="form.plan"
                            prefix-icon="x"
                            :clearable="false"
                            type="datetime"
                            placeholder="必填"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"></el-date-picker>
          </div>
        </template>
        <template v-else>
          <div slot="remark"
               v-html="form.plan"></div>
        </template>
      </item>
      <template v-if="canEdit">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleGrasp">
          <div class="el-dropdown-link">
            <item label="把握度"
                  :remark="graspTxt"></item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(grasp,i) in grasps"
                              :key="i"
                              :command="grasp">{{grasp.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <item label="把握度"
              :hasClick="false"
              :remark="graspTxt"></item>
      </template>
      <template v-if="canEdit">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleWether">
          <div class="el-dropdown-link">
            <item label="需要招投标"
                  :remark="wetherTxt"></item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(w,i) in wethers"
                              :key="i"
                              :command="w">{{w.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <item label="需要招投标"
              :hasClick="false"
              :remark="wetherTxt"></item>
      </template>
      <template v-if="canEdit">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleState">
          <div class="el-dropdown-link">
            <item label="状态"
                  :remark="stateTxt"></item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(state,i) in states"
                              :key="i"
                              :command="state">{{state.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <item label="状态"
              :hasClick="false"
              :remark="stateTxt"></item>
      </template>
      <template v-if="canEdit">
        <keep-alive>
          <EditorSimple :store.sync="editorMessage"
                        :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
        </keep-alive>
      </template>
      <template v-else>
        <div class="remark"
             v-html="editorMessage.content"></div>
      </template>
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
  import DateUtils from '@/utils/date'
  import Api1062 from '@/views/business/1062/api'
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
          plan: '', // 发货计划
          time: '', // 时间预测
          state: null, // 状态
          grasp: null, // 把握度
          wether: null, // 需要招投标
          products: null // 金额预测
        },
        grasps: [],
        states: [],
        wethers: [
          {
            name: '是',
            value: '1'
          },
          {
            name: '否',
            value: '2'
          }
        ]
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
        return this.form.id ? '项目' : '新建项目'
      },
      isCreate() {
        return this.form.id === undefined || this.form.id === 0
      },
      canEdit() {
        return this.isCreate || ((this.admin || this.form.userId === this.userId) && this.crm.isFinish !== '1')
      },
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || (this.canEdit ? '必填' : '')
      },
      agentTxt() {
        let agent = this.form.agent || {}
        return agent.name || (this.canEdit ? '选填' : '')
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || (this.canEdit ? '必填' : '')
      },
      wetherTxt() {
        let wether = this.form.wether || {}
        return wether.name || (this.canEdit ? '必填' : '')
      },
      graspTxt() {
        let grasp = this.form.grasp || {}
        return grasp.name || (this.canEdit ? '必填' : '')
      },
      stateTxt() {
        let state = this.form.state || {}
        return state.name || (this.canEdit ? '必填' : '')
      },
      amountTxt() {
        let products = this.form.products
        if (Check.isRealArray(products)) {
          let amount = ''
          products.forEach(v => {
            amount += (parseFloat(v.price) * parseFloat(v.count)).toFixed(2)
          })
          return amount
        }
        return '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyMessage']),
      fetchData() {
        let pid = this.routeQuery('pid')
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let customer = this.getStorage('_crm_business_customer_cache')
          this.form.customer = customer || this.form.customer
          let agent = this.getStorage('_crm_business_agent_cache')
          this.form.agent = agent || this.form.agent
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          if (this.crm.products) {
            this.form.products = this.crm.products
            this.deleteCrmProp('products')
          }
        } else if (pid) {
          MessageApi.getMessageById(pid).then(res => {
            if (res.message) {
              let m = res.message
              let mJson = JSON.parse(m.msgJson || '{}')
              this.form = {
                ...this.form,
                id: m.id || void 0,
                userId: m.fromUserId,
                name: mJson.name,
                person: {
                  userId: mJson.userId,
                  name: mJson.userName
                }, // 负责人
                customer: {
                  id: mJson.clientId,
                  name: mJson.clientName
                }, // 客户
                plan: DateUtils.format(mJson.deliveryDate, 'yyyy-MM-dd'), // 发货计划
                time: DateUtils.format(mJson.expectSignDate, 'yyyy-MM-dd'), // 时间预测
                state: {
                  value: mJson.progress,
                  name: mJson.progressDesc
                }, // 状态
                grasp: {
                  description: mJson.power,
                  name: mJson.powerDesc
                }, // 把握度
                wether: mJson.isNeedBid === '1' ? this.wethers[0] : this.wethers[1] // 需要招投标
              }
              if (mJson.agentId) {
                this.form.agent = {
                  id: mJson.agentId,
                  name: mJson.agentName
                }
              }
              if (mJson.products) {
                this.form.products = mJson.products.map(v => {
                  return {
                    id: v.productId,
                    name: v.productName,
                    price: v.price,
                    count: v.num
                  }
                }) // 金额预测
              }
              this.editorMessage = {
                content: mJson.remark,
                medias: m.medias
              }
            }
          })
        }

        CategoryApi.getCategorysByType('53').then(res => {
          this.grasps = res.categorys || []
        })
        CategoryApi.getCategorysByType('166').then(res => {
          this.states = res.categorys || []
        })

        if (this.crm.params) {
          this.deleteCrmProp('params')
        }
      },
      handleAmount() {
        this.setCrm({ form: this.form, products: this.form.products })
        this.routePush({ path: '/vx/group/business/1085/productAmount' })
      },
      handleWether(item) {
        this.form.wether = item
      },
      handleCustomer() {
        const that = this
        if (!this.canEdit) {
          this.routePush({
            path: '/vx/group/business/create/default',
            query: {
              appType: '1062',
              groupId: this.groupId,
              cid: this.form.customer.id
            }
          })
        } else {
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
        }
      },
      handleAgent() {
        const that = this
        if (!this.canEdit) {
          this.routePush({
            path: '/vx/group/business/1079/detail',
            query: {
              aid: this.form.agent.id
            }
          })
        } else {
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
        }
      },
      handleGrasp(item) {
        this.form.grasp = item
      },
      handleState(item) {
        this.form.state = item
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
        if (Check.isNullString(form.name)) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '负责人不能为空', type: 'warning' })
          return false
        }
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.products)) {
          that.$message({ message: '金额预测不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.time)) {
          that.$message({ message: '时间预测不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.plan)) {
          that.$message({ message: '发货计划不能为空', type: 'warning' })
          return false
        }
        if (!form.grasp) {
          that.$message({ message: '把握度不能为空', type: 'warning' })
          return false
        }
        if (!form.state) {
          that.$message({ message: '状态不能为空', type: 'warning' })
          return false
        }

        let mJson = {
          id: form.id || void 0,
          expectSignDate: DateUtils.format_0800(form.time),
          products: form.products.map(v => {
            return {
              productId: v.id,
              productName: v.name,
              price: v.price,
              num: v.count,
              amount: (parseFloat(v.price) * parseFloat(v.count)).toFixed(2)
            }
          }),
          remark: this.editorMessage.content,
          name: form.name,
          power: form.grasp.description,
          powerDesc: form.grasp.name,
          progress: form.state.value,
          progressDesc: form.state.name,
          isNeedBid: form.wether.value,
          userId: form.person.userId,
          userName: form.person.name,
          clientId: form.customer.id,
          clientName: form.customer.name,
          deliveryDate: DateUtils.format_0800(form.time)
        }

        if (form.agent) {
          mJson.agentId = form.agent.id
          mJson.agentName = form.agent.name
        }

        let postData = this.constructionMessage({
          ...this.editorMessage,
          groupId: this.groupId,
          type: '108501',
          msgJson: JSON.stringify(mJson)
        })

        if (form.id) {
          postData.id = form.id
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
          })
        } else {
          that.addMessage(postData).then(res => {
            that.deleteCrmProp('form')
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        }
      },
      handleBack() {
        if (this.isCreate) {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.deleteCrmProp('form')
            this.routeBack()
          })
        } else {
          this.deleteCrmProp('form')
          this.routeBack()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .customer-create {
    .remark {
      padding: rem(10);
    }
  }
</style>
