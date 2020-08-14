<template>
  <Page title="新建还货"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="还货人"
          @click="handleReturner"
          :remark="returnerTxt"></item>
    <item label="此前在借"
          :hasClick="hasBorrow"
          @click="handleBorrow"
          :remark="borrowTxt"></item>
    <template v-if="form.products.length > 0">
      <div class="category-title text">还货数量</div>
      <item v-for="(item, i) in form.products"
            :key="i"
            :label="item.productName"
            :hasClick="false">
        <input slot="remark"
               placeholder="数量"
               v-model="item.value"
               @keyup="handleNumber(item)" />
        <div slot="after"
             v-html="item.unit"></div>
      </item>
    </template>
    <div class="category-title"></div>
    <item label="接收人"
          @click="handlePerson"
          :remark="personTxt"></item>
    <item :hasClick="false"
          label="还货日期">
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
  import Api1105 from '@/views/business/1105/api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          returner: null,
          person: null,
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
      returnerTxt() {
        let returner = this.form.returner || {}
        return returner.name || '必填'
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
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      loadBorrowList() {
        Api1105.getBorrowList(this.groupId, this.form.returner.userId)
          .then(res => {
            if (res.records) {
              this.form.borrow = {
                records: res.records,
                remark: res.inBorrow
              }
              this.form.products = res.records.map(v => {
                return { ...v, value: v.num }
              })
            } else {
              this.form.products = []
            }
          })
          .catch(res => {
            this.form.products = []
          })
      },
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let returner = this.getStorage('_crm_business_returner_cache')
          if (returner) {
            this.form.returner = returner
            this.loadBorrowList()
          }
          if (this.crm.borrow) {
            this.deleteCrmProp('borrow')
          }
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          this.deleteCrmProp('form')
        } else {
          this.form.returner = this.getRelationById(this.groupId, this.userId)
          this.loadBorrowList()
        }
      },
      handleNumber(item) {
        if (item.value > item.num || item.value < 1) {
          this.$set(item, 'number', item.num)
        }
      },
      handleReturner() {
        let params = {
          property: 'returner',
          users: this.form.returner ? [this.form.returner] : []
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleBorrow() {
        this.setCrm({ form: this.form, borrow: this.form.borrow })
        this.routePush({ name: 'borrowInfo1105' })
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
        if (!form.returner) {
          that.$message({ message: '还货人不能为空', type: 'warning' })
          return false
        }
        if (!form.person) {
          that.$message({ message: '接收人不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.date)) {
          that.$message({ message: '还货日期不能为空', type: 'warning' })
          return false
        }

        let products = form.products.filter(v => {
          return Check.isNumber(v.value)
        })
        if (!Check.isRealArray(products)) {
          that.$message({ message: '至少归还一件产品', type: 'warning' })
          return false
        }

        let person = form.person
        let returner = form.returner
        let postData = that.constructionMessage({
          ...editor,
          type: '1211',
          groupId: that.groupId,
          status: '3',
          msgJson: JSON.stringify({
            restitution: {
              returnDate: DateUtils.format_0800(form.date),
              userId: returner.userId,
              userName: returner.name,
              products: products.map(v => {
                return {
                  productId: v.productId,
                  productName: v.productName,
                  useNum: v.value,
                  num: v.num,
                  unit: v.unit || '',
                  amount: v.amount || 0,
                  price: v.price || 0
                }
              })
            }
          }),
          toUsers: [
            {
              userId: returner.userId,
              name: returner.name,
              status: '1',
              avatar: returner.avatar,
              userType: returner.userType,
              type: 'creator'
            },
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
