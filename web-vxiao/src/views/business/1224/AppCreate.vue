<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item :label="personLabel"
          @click="handlePerson"
          :remark="personTxt"></item>
    <item :hasClick="false"
          :label="dateLabel">
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
    <template v-if="form.products.length > 0">
      <div class="category-title"></div>
      <item v-for="(item, i) in form.products"
            :key="i"
            :label="item.name"
            :hasClick="false">
        <input slot="remark"
               placeholder="数量"
               v-model="item.value" />
        <div slot="after"
             v-html="item.unit"></div>
      </item>
    </template>
    <div class="category-title"></div>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="备注"
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
  import Api1046 from '@/views/business/1046/api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          person: null,
          products: [],
          date: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm',
        getSchool: 'getSchoolBySchoolId'
      }),
      appType() {
        return this.routeQuery('appType')
      },
      title() {
        return `新建${this.appType === '1224' ? '入库' : '报废'}`
      },
      personLabel() {
        return this.appType === '1224' ? '接收人' : '审批人'
      },
      personTxt() {
        let person = this.form.person || {}
        return person.name || '必填'
      },
      dateLabel() {
        return this.appType === '1224' ? '入库日期' : '报废日期'
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let person = this.getStorage('_crm_business_person_cache')
          this.form.person = person || this.form.person
          this.deleteCrmProp('form')
        } else {
          this.form.person = this.getRelationById(this.groupId, this.userId)
          let school = this.getSchool(this.schoolId)
          Api1046.getProducts(school.groupId).then(res => {
            if (res.productManages) {
              let products = []
              res.productManages.forEach(v => {
                if (v.type !== '1') {
                  products.push({ ...v, value: '' })
                }
              })
              this.form.products = products
            }
          })
        }
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
        if (!form.person) {
          that.$message({ message: `${this.personLabel}不能为空`, type: 'warning' })
          return false
        }
        if (Check.isNullString(form.date)) {
          that.$message({ message: `${this.dateLabel}不能为空`, type: 'warning' })
          return false
        }

        let products = form.products.filter(v => {
          return Check.isNumber(v.value)
        })
        if (!Check.isRealArray(products)) {
          that.$message({ message: `至少${this.appType === '1224' ? '入库' : '报废'}一个产品`, type: 'warning' })
          return false
        }
        products = products.map(v => {
          return {
            productName: v.name,
            productId: v.id,
            unit: v.unit,
            useNum: v.value
          }
        })

        let mJson = {}
        if (this.appType === '1224') {
          mJson.productEnter = {
            enterDate: DateUtils.format_0800(form.date),
            products: products
          }
        } else {
          mJson.productScrap = {
            scrapDate: DateUtils.format_0800(form.date),
            products: products
          }
        }

        let person = form.person
        let postData = that.constructionMessage({
          ...editor,
          type: that.appType,
          groupId: that.groupId,
          status: '3',
          msgJson: JSON.stringify(mJson),
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
