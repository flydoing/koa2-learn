<template>
  <Page title="详情"
        @back="handleBack"
        listenBack
        @scrollEnd="scrollEnd">
    <div>
      <Card v-if="message"
            :message="message">
        <template slot="toolbar"></template>
        <template slot="down"></template>
      </Card>
    </div>
    <div class="category-title"></div>
    <template v-if="cms.length>0">
      <div class="card-list">
        <template v-for="(m, i) in cms">
          <card125701 v-if="m.status !== '2'"
                      :message="m"
                      :key="m.id"
                      @shield="handleShield(m, i)" />
        </template>
      </div>
    </template>
    <template v-else>
      <CardTips text="暂无内容" />
    </template>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import MixinMessage from '@/views/group/mixinMessage'
  import ArrayUtils from '@/utils/array'

  export default {
    mixins: [R, MixinMessage],
    components: {
      Card125701: resolve => require(['@/views/business/125701/Card'], resolve),
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        message: null,
        childMessages: []
      }
    },
    computed: {
      cms() {
        if (Check.isRealArray(this.childMessages)) {
          return this.childMessages.filter(v => {
            return v.status !== '2'
          })
        }
        return []
      }
    },
    methods: {
      getMessage() {
        const that = this
        let msgId = that.routeQuery('msgId')
        MessageApi.getMessageById(msgId).then(res => {
          that.message = res.message
          this.modifyChannelMessage(res.message)
          this.getChildMessages()
        })
      },
      getChildMessages() {
        this.getMessages({
          groupId: this.groupId,
          type: '125701',
          queryType: 'parentId',
          parentId: this.message.id,
          userId: this.userId,
          currentPage: this.currentPage
        })
          .then(res => {
            this.childMessages.push(...res.messages)
          })
          .catch(res => {})
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.getChildMessages()
        }
      },
      handleBack() {
        if (this.routeQuery('skip')) {
          this.routeBack(-2)
        } else {
          this.routeBack()
        }
      },
      handleShield(message, index) {
        const that = this
        let m = { ...message, status: '2' }
        that.modifyMessage(m).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.$set(this.childMessages, index, m)
        })
      }
    },
    mounted() {
      this.getMessage()
    },
    watch: {
      channelMessage(v) {
        let that = this
        if (Check.isRealArray(that.childMessages)) {
          v.some(m => {
            if (m.groupId === this.groupId) {
              let isExist = false
              that.childMessages.some((_m, i) => {
                if (_m.id === m.id) {
                  if (m.status === 'd') {
                    that.childMessages.splice(i, 1)
                    setTimeout(() => {
                      that.removeChannelMessage(m)
                    }, 100)
                    return true
                  }
                  let praises = ArrayUtils.update(_m.praises || [], m.praises || [])
                  let replys = ArrayUtils.update(_m.replys || [], m.replys || [])
                  let toUsers = ArrayUtils.update(_m.toUsers || [], m.toUsers || [])
                  that.$set(that.childMessages, i, {
                    ..._m,
                    ...m,
                    ...{
                      toUsers: toUsers,
                      praises: praises,
                      replys: replys
                    }
                  })
                  setTimeout(() => {
                    that.removeChannelMessage(m)
                  }, 100)
                  isExist = true
                  return true
                }
              })
              // 不存在、
              // 且状态不是删除状态
              // 且不存在parentId 或者 parentId = 0 （主消息）
              if (!isExist && m.status !== 'd' && (m.parentId === 0 || !m.hasOwnProperty('parentId'))) {
                that.childMessages.push(m)
              }
            }
          })
        }
      }
    }
  }
</script>
