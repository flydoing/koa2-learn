<template>
  <page title="备注"
        @submit="handleSubmit"
        :hasSubmit="canEdit">
    <template v-if="canEdit">
      <TextInput placeholder="输入内容"
                 max="200"
                 v-model="remark"></TextInput>
    </template>
    <template v-else>
      <div class="pd"
           v-html="remark"></div>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from './api'
  // import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        remark: ''
      }
    },
    created() {
      let form = this.crm.form || {}
      this.remark = form.remark || ''
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      canEdit() {
        return this.crm.canEdit || true
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyChannelMessage']),
      handleSubmit() {
        let form = this.crm.form
        Api.modifyCustomer(
          {
            clients: [
              {
                id: form.id,
                parentId: this.currentGroup.id,
                description: this.remark
              }
            ],
            msgId: form.msgId
          },
          form.msgId
        ).then(res => {
          this.modifyChannelMessage(res.messages[0])
          GroupApi.addGroup({
            groups: [
              {
                id: form.id,
                description: this.remark
              }
            ]
          }).then(result => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
