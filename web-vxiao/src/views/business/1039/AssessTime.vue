<template>
  <page title="工时评估" @submit="handleSubmit" hasSubmit>
    <item :hasClick="false" v-for="(item,i) in assessors" :item="item" :key="i">
      <div slot="main" v-html="item.name"></div>
      <input slot="remark" class="align-right" placeholder="天数" v-model="item.value" />
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'

  export default {
    mixins: [R],
    components: {
      Table: resolve => require(['@/components/table/Table'], resolve)
    },
    props: {},
    computed: {},
    data() {
      return {
        assessors: [],
        msgId: this.routeParam('msgId')
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        MessageApi.getMessageById(that.msgId).then(res => {
          that.assessors = res.message.toUsers.filter(u => {
            u.value = u.value || 0
            return u.type === 'to' && u.status !== 'd' && u.status !== '4'
          })
        })
      },
      handleSubmit() {
        this.modifyMessage({
          id: this.msgId,
          toUsers: this.assessors
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }

</script>
