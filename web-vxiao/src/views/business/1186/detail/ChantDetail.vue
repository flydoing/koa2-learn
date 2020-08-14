<template>
  <Page title="诵读详情"
        @scrollEnd="scrollEnd">
    <div class="chant-message">
      <p class="chant-message-title">{{msgJson.title || '佚名'}}</p>
      <p class="chant-message-author">作者：{{msgJson.author || '佚名'}}</p>
      <p class="chant-message-content"
         v-html="mainMsg.content"></p>
    </div>
    <div class="category-title text">诵读</div>
    <!-- <CardList v-if="messages.length > 0" :messages="childrenMsg"></CardList> -->
    <template v-if="mainMsg.fromUserId && childrenMsg.length > 0">
      <Card1187 v-for="(m, i) in childrenMsg"
                :message="ruleMessage(m)"
                :fromUserId="mainMsg.fromUserId"
                :key="i" />
    </template>
    <CardTips v-else
              text="暂无人上传录音" />
    <div class="bottom-tips"
         slot="bottom">请使用APP进行录音操作</div>
  </Page>
</template>
<script>
  import MsgApi from '@/api/message'
  import Api from '@/views/business/1002/api'
  import CategoryEnum from '@/constant/category'
  import M from '@/views/business/mixin'
  import CardMixin from '@/views/components/card/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [CardMixin, M, MixinMessage],
    components: {
      Card1187: resolve => require(['./ChantChildCard'], resolve)
    },
    data() {
      return {
        mainMsg: {},
        msgJson: { title: '' },
        childrenMsg: [],
        scoreTyepChild: [],
        scoreType: {}
      }
    },
    created() {
      const that = this
      MsgApi.getMessageById(that.routeQuery('msgId'))
        .then(res => {
          that.mainMsg = res.message
          that.msgJson = that.mainMsg.msgJson
            ? JSON.parse(that.mainMsg.msgJson)
            : {
                title: ''
              }
        })
        .catch(res => {
          that.$message({
            type: 'error',
            message: res.message
          })
        })
      let sgroupId = that.getSchoolGroupId(that.currentGroup.parentId)
      Api.getScoreType(sgroupId, that.routeQuery('appType')).then(res => {
        if (res && res.code === '1') {
          let metaDatas = res.metaDatas.filter(mate => {
            return mate.metaType === 'm_recite_score_type'
          })
          res.categories.forEach(c => {
            if (c.id === Number(metaDatas[0].obj)) {
              that.scoreType = c
            }
          })
          that.scoreType.value === '1' &&
            Api.getScoreTypeChild(CategoryEnum.SCORESHOW_CHILD, that.scoreType.id, '0').then(res => {
              if (res && res.code === '1') {
                that.scoreTyepChild = res.categorys
              }
            })
          that.loadMessages()
        }
      })
    },
    methods: {
      ruleMessage(m) {
        m.scoreTyepChild = this.scoreTyepChild
        m.scoreType = this.scoreType || {}
        return m
      },
      loadMessages() {
        this.getMessages({
          groupId: this.currentGroup.groupId,
          currentPage: this.currentPage,
          queryType: 'parentId',
          parentId: this.routeQuery('msgId'),
          type: '1187'
        })
          .then(res => {
            this.childrenMsg = [...this.childrenMsg, ...res.messages]
          })
          .catch(res => {})
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .chant-message {
    padding: rem(10);

    &-title {
      text-align: center;
      font-size: rem(16);
    }

    &-author {
      text-align: center;
      margin: rem(10) 0;
    }
  }

  .chant-child-message {
    background-color: #ededed;
  }

  .bottom-tips {
    height: rem(30);
    line-height: rem(30);
    text-align: center;
  }
</style>
