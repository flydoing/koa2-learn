<template>
  <page title="选择模板">
    <div class="card-list message-templates">
      <template v-if="messages.length>0">
        <card10029 v-for="(m, i) in messages"
                   :message="m"
                   :key="i"
                   :index="i"
                   @click="handleMessage"
                   @remove="handleRemove" />
      </template>
      <template v-else>
        <CardTips text="暂无内容" />
      </template>
    </div>
  </page>
</template>
<script>
  import Api from '@/api/message'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Card10029: resolve => require(['@/views/business/10029/Card'], resolve),
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        messages: []
      }
    },
    created() {
      let ms = []
      let type = this.routeQuery('type')
      Api.getMessageTemplates(this.currentGroup.parentId, type).then(res => {
        if (Check.isRealArray(res.templates)) {
          res.templates.forEach((v, i) => {
            ms.push({
              ...v.message,
              id: v.id,
              createTime: v.createTime,
              fromUserId: v.userId,
              type: '',
              appType: v.appType,
              groupId: v.groupId
            })
          })
        }
        this.messages = ms
      })
    },
    methods: {
      handleMessage(message) {
        this.setStorage('_message_template_cache', message)
        this.routeBack()
      },
      handleRemove(message, i) {
        Api.saveMessageTemplate({
          id: message.id,
          groupId: message.groupId,
          appType: message.appType,
          status: 'd',
          userId: this.userId
        }).then(res => {
          this.messages.splice(i, 1)
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
<style lang="scss">
  .message-templates {
    .vx-card {
      cursor: pointer;
    }
    label {
      cursor: pointer;
    }
  }
</style>
