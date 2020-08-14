<template>
  <Page title="新建运营"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="客户"
          :remark="customerTxt"
          @click="handleCustomer"></item>
    <item label="签到/签退"
          :remark="signTxt"
          @click="handleSign"></item>
    <item label="活跃"
          :hasClick="false"
          :remark="form.activeRate"></item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import GroupApi from '@/api/group'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          customer: null,
          signs: [],
          activeRate: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      customerTxt() {
        let customer = this.form.customer || {}
        return customer.name || '必填'
      },
      signTxt() {
        if (Check.isRealArray(this.form.signs)) {
          return '已选'
        }
        return ''
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        let customer = this.crm.customer
        if (customer) {
          this.form.customer = customer
          Api.getCustomerActive(customer.id).then(res => {
            this.form.activeRate = res.activeRate || ''
          })
          this.deleteCrmProp('customer')
        }
        let signs = this.crm.signs
        if (signs) {
          this.form.signs = signs
          this.deleteCrmProp('signs')
        }
      },
      handleCustomer() {
        const that = this
        let params = {
          property: 'customer',
          getListData: function(callback) {
            GroupApi.getSchools(that.groupId).then(res => {
              callback(res.schools || [])
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
      handleSign() {
        const that = this
        this.setCrm({
          signs: this.form.signs,
          params: {
            getDataList: cback => {
              Api.getSigns(that.groupId, '1119').then(res => {
                cback && cback(res.datas || [])
              })
            }
          }
        })
        this.routePush({ path: '/vx/group/business/1046/selectSign' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.customer) {
          that.$message({ message: '客户不能为空', type: 'warning' })
          return false
        }

        let signIn = null
        let signOut = null
        form.signs.forEach(v => {
          if (v.type === '1') {
            signIn = v
          } else {
            signOut = v
          }
        })

        if (!signIn && !signOut) {
          that.$message({ message: '签到地点和签退地点必须填一个', type: 'warning' })
          return false
        }
        if (signIn && signOut) {
          let s = new Date(signIn.modifyTime).getTime()
          let e = new Date(signOut.modifyTime).getTime()
          if (s > e) {
            that.$message({ message: '签到时间不得晚于签退时间', type: 'warning' })
            return false
          }
        }

        let postData = that.constructionMessage({
          ...editor,
          type: '1119',
          groupId: that.groupId,
          extension: `活跃：${form.activeRate}`,
          msgJson: JSON.stringify({
            object: {
              schoolId: form.customer.id,
              schoolName: form.customer.name
            }
          }),
          positions: form.signs.map(v => {
            return {
              id: v.id,
              createTime: v.modifyTime,
              latitude: v.extension,
              longitude: v.value,
              name: v.name,
              type: v.type === '1' ? '0' : '1',
              range: v.range
            }
          })
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
