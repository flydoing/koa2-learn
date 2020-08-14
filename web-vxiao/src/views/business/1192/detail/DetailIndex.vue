<template>
  <page title="评课" :hasClose="false" @scrollEnd="scrollEnd">
    <div slot="btn" v-if="!mainMsg.remark">
      <label @click="createCommentHandle">新建评课</label>
    </div>
    <div class="public-course">
      <div class="category-title text" v-if="!lecturerIdBol && !isAnonymousBol && messages.length>0">{{mainMsg.extensionType}}</div>
      <div class="category-title text" v-else-if="lecturerIdBol && !isAnonymousBol && messages.length>0">自评</div>
      <div v-if="messages.length <= 0" class="public-course-tips">
        <div>
          <img v-lazy="{src:'/static/ico/icon_commoneuse.png'}" alt="" />
          <p>暂无评分</p>
        </div>
      </div>
      <CardList :messages="messages" v-else></CardList>
    </div>
  </page>
</template>
<script>
  import Api from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        mainMsg: {},
        lecturerIdBol: false,
        isAnonymousBol: false // 是否匿名评课
      }
    },
    created() {
      this.loadMessages()
      Api.getMessageById(this.routeQuery('msgId')).then(res => {
        if (res && res.code === '1') {
          this.mainMsg = res.message
          this.lecturerIdBol = Number(JSON.parse(this.mainMsg.msgJson).userId) === this.userId
          this.isAnonymousBol = JSON.parse(this.mainMsg.msgJson).hasOwnProperty('isAnonymous') ? Number(JSON.parse(
            this.mainMsg.msgJson).isAnonymous) : null
        }
      })
    },
    methods: {
      loadMessages(page) {
        this.getMessages({
          groupId: this.currentGroup.groupId,
          currentPage: page,
          queryType: 'parentId',
          parentId: this.routeQuery('msgId'),
          type: '1193'
        }).then(res => {}).catch(res => {})
      },
      createCommentHandle() {
        this.routePush({
          name: 'createComment1192',
          query: {
            templateId: JSON.parse(this.mainMsg.msgJson).templateId,
            msgId: this.routeQuery('msgId')
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .public-course {
    &-list {
      background-color: nth($background, 1);
    }
    &-tips {
      @include flex;
      @include jc;
      @include ai;
      height: rem(300);
      background-color: #fff;
      div {
        p {
          margin-top: rem(20);
          font-size: rem(16);
          color: #9f9f9f;
        }
      }
    }
  }

</style>
