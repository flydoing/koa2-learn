<template>
  <Page title="新建借货"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="借货人"
          @click="handleLender"
          :remark="lenderTxt"></item>
    <item label="此前在借"
          :hasClick="hasBorrow"
          @click="handleBorrow"
          :remark="borrowTxt"></item>
    <div class="category-title"></div>
    <item label="产品"
          @click="handleProduct"
          :remark="productTxt"></item>
    <item label="收货信息"
          @click="handleReceive"
          :remark="receiveTxt">
    </item>
    <div class="category-title"></div>
    <item label="审批人"
          @click="handleApprover"
          :remark="approverTxt"></item>
    <item label="发货人"
          @click="handlePerson"
          :remark="personTxt"></item>
    <item :hasClick="false"
          label="预计归还日期">
      <div slot="after">
        <el-date-picker v-model="form.date"
                        prefix-icon="x"
                        :clearable="false"
                        type="date"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="借货说明"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          lender: null,
          approver: null,
          person: null,
          receive: null,
          borrow: null,
          products: [],
          date: ''
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
      lenderTxt() {
        let lender = this.form.lender || {}
        return lender.name || '必填'
      },
      borrowTxt() {
        let borrow = this.form.borrow || {}
        return borrow.remark || '暂未借'
      },
      hasBorrow() {
        let borrow = this.form.borrow || {}
        let records = borrow.records || []
        return records.length > 0
      },
      receiveTxt() {
        let receive = this.form.receive || {}
        return receive.addressee ? `${receive.addressee}，${receive.mobile}` : '必填'
      },
      productTxt() {
        let products = this.form.products
        if (Check.isRealArray(products)) {
          let pMap = new Map()
          products.forEach(v => {
            let count = pMap.get(v.unit)
            if (count) {
              pMap.set(v.unit, parseInt(v.value) + parseInt(count))
            } else {
              pMap.set(v.unit, parseInt(v.value))
            }
          })
          let ps = [...pMap.keys()].map(v => {
            return `${pMap.get(v)}${v}`
          })
          return ps.join('，')
        }
        return ''
      },
      approverTxt() {
        let approver = this.form.approver || {}
        return approver.name || '必填'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      loadBorrowList() {
        Api.getBorrowList(this.groupId, this.form.lender.userId).then(res => {
          if (res.records) {
            this.form.borrow = {
              records: res.records,
              remark: res.inBorrow
            }
          }
        })
      },
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let lender = this.getStorage('_crm_business_lender_cache')
          if (lender) {
            this.form.lender = lender
            this.loadBorrowList()
          }
          if (this.crm.borrow) {
            this.deleteCrmProp('borrow')
          }
          if (this.crm.receive) {
            this.form.receive = this.crm.receive
            this.deleteCrmProp('receive')
          }
          if (this.crm.products) {
            this.form.products = this.crm.products
            this.deleteCrmProp('products')
          }
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          let approver = this.getStorage('_crm_business_approver_cache')
          this.form.approver = approver || this.form.approver
          this.deleteCrmProp('form')
        } else {
          this.form.lender = this.getRelationById(this.groupId, this.userId)
          this.loadBorrowList()
        }
      },
      handleLender() {
        let params = {
          property: 'lender',
          users: this.form.lender ? [this.form.lender] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleBorrow() {
        this.setCrm({ form: this.form, borrow: this.form.borrow })
        this.routePush({ name: 'borrowInfo1105' })
      },
      handleReceive() {
        this.setCrm({ form: this.form, receive: this.form.receive })
        this.routePush({ name: 'receiveInfo1105' })
      },
      handleProduct() {
        this.setCrm({ form: this.form, products: this.form.products })
        this.routePush({ name: 'selectProduct1105' })
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
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.lender) {
          that.$message({ message: '借货人不能为空', type: 'warning' })
          return false
        }
        if (!form.receive) {
          that.$message({ message: '收货信息不能为空', type: 'warning' })
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
        if (!Check.isRealArray(form.products)) {
          that.$message({ message: '产品不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.date)) {
          that.$message({ message: '预计归还时间不能为空', type: 'warning' })
          return false
        }

        let person = form.person
        let approver = form.approver
        let receive = form.receive
        let areas = []
        if (Check.isRealArray(receive.selectAreas)) {
          areas = receive.selectAreas.map(v => {
            return receive.area[v].label
          })
        }

        let postData = that.constructionMessage({
          ...editor,
          type: '1105',
          groupId: that.groupId,
          status: '3',
          msgJson: JSON.stringify({
            borrow: {
              returnDate: DateUtils.format_0800(form.date),
              userId: form.lender.userId,
              userName: form.lender.name,
              products: form.products.map(v => {
                return {
                  productId: v.id,
                  productName: v.name,
                  useNum: v.value,
                  unit: v.unit || ''
                }
              }),
              express: {
                name: receive.addressee,
                phone: receive.mobile,
                area: areas.join(' '),
                address: receive.address
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
