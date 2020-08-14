<template>
  <page title="草稿">
    <item v-for="(item, i) in drafts"
          :key="i"
          @click="handleDraft(item)">
      <div slot="main">{{item.title}}</div>
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
  </page>
</template>
<script>
  import MessageApi from '@/api/message'
  import Api from './api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        drafts: []
      }
    },
    created() {
      Api.getPraxisDrafts(this.groupId).then((res) => {
        this.drafts = res.datas || []
      })
    },
    methods: {
      handleDraft(item) {
        this.setStorage('_praxis_draft_cache', item)
        this.routeBack()
      },
      handleRemove(item, i) {
        const that = this
        that
          .$confirm('确认删除该草稿？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            MessageApi.modifyMessage({
              msgJson: JSON.stringify({
                id: item.id,
                status: 'd'
              }),
              type: '1047',
              msgType: 'praxis'
            }).then((res) => {
              that.drafts.splice(i, 1)
              that.$message({ message: '操作成功', type: 'success' })
            })
          })
      }
    }
  }
</script>
