<template>
  <Page title="新建拜访"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="拜访对象"
          :remark="objTxt"
          @click="handleObject"></item>
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showContact">
      <Scroller :height="300">
        <Item v-for="(item, i) in contacts"
              :key="i"
              @click="handleContact(item)"
              :label="item.name">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="联系人"
            :remark="contactTxt">
      </Item>
    </el-popover>

    <item label="签到/签退"
          :remark="signTxt"
          @click="handleSign"></item>
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
  import Api1079 from '@/views/business/1079/api'
  import Api1062 from '@/views/business/1062/api'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          object: null,
          contact: null,
          signs: [],
          type: '1083'
        },
        contacts: [],
        showContact: false
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      objTxt() {
        let obj = this.form.object || {}
        return obj.name || '必填'
      },
      contactTxt() {
        let contact = this.form.contact || {}
        return contact.name || '必填'
      },
      signTxt() {
        if (Check.isRealArray(this.form.signs)) {
          return '已选'
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        let agent = this.crm.agent
        if (agent) {
          Api1079.getContacts(agent.id).then(res => {
            this.contacts = res.datas || []
          })
          this.form.object = agent
          this.form.type = '1084'
          this.deleteCrmProp('agent')
        }
        let customer = this.crm.customer
        if (customer) {
          Api1062.getContacts(customer.id).then(res => {
            this.contacts = res.contacts || []
          })
          this.form.object = customer
          this.form.type = '1083'
          this.deleteCrmProp('customer')
        }
        let signs = this.crm.signs
        if (signs) {
          this.form.signs = signs
          this.deleteCrmProp('signs')
        }
      },
      handleObject() {
        this.routePush({
          path: '/vx/group/business/1046/selectObject',
          query: {
            title: '拜访对象'
          }
        })
      },
      handleContact(item) {
        this.showContact = false
        this.form.contact = item
      },
      handleSign() {
        const that = this
        this.setCrm({
          signs: this.form.signs,
          params: {
            getDataList: cback => {
              Api.getSigns(that.groupId, '1083').then(res => {
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
        if (!form.object) {
          that.$message({ message: '拜访对象不能为空', type: 'warning' })
          return false
        }
        if (!form.contact) {
          that.$message({ message: '联系人不能为空', type: 'warning' })
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

        if (that.editorMessage.content.length < 50) {
          that.$message({ message: '拜访纪要不能少于50字', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: form.type,
          groupId: that.groupId,
          clientId: form.object.id,
          categoryId: form.contact.id,
          msgJson: JSON.stringify({
            attendanceIds: form.signs.map(v => {
              return v.id
            })
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
          }),
          ...this.editorMessage
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
