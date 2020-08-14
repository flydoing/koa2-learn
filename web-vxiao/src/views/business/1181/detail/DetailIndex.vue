<template>
  <page :title="mainMsg.title" :hasClose="false" :hasSubmit="!isTeacher" @submit="commitModelEssay" @scrollEnd="onScrollEnd">
    <div class="model-essay">
      <div class="model-essay-content">
        <p class="model-essay-author">作者：{{author}}</p>
        <!-- <p v-html="mainMsg.content"></p> -->
        <card-content :content="mainMsg.content" :more="false"></card-content>
      </div>
      <div class="category-title text">
        读后感
        <span v-if="childList.length>0">{{childList.length}}</span>
      </div>
      <div class="model-essay-editor" v-if="!isTeacher">
        <keep-alive>
          <ueSimple placeholder="(10字以上)" :toolbars="['photo']" :store.sync="replyObj" />
        </keep-alive>
      </div>
      <div class="model-essay-list">
        <CardChild :message="m" v-for="(m, i) in childList" :key="i"></CardChild>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  import CardMixin from '@/views/components/card/mixin'
  import M from '@/views/business/mixin'
  export default {
    mixins: [CardMixin, M],
    components: {
      CardChild: resolve => require(['@/views/business/1182/Card'], resolve),
      UeSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        childList: [],
        mainMsg: {},
        replyObj: {
          content: '',
          medias: []
        },
        childCurPage: 1,
        chaildHasNext: 0,
        author: ''
      }
    },
    created() {
      Api.getTheMsg(this.routeQuery('msgId')).then(res => {
        if (res && res.code === '1') {
          this.mainMsg = res.message
          this.author = JSON.parse(this.mainMsg.msgJson).author || '佚名'
        }
      })
      this.loadChildList()
    },
    methods: {
      commitModelEssay() {
        let that = this
        if (that.replyObj.content.length < 10) {
          this.$message({
            type: 'warning',
            message: '内容不能少于10个字'
          })
          return false
        }
        let reqBody = {
          message: {
            content: that.replyObj.content,
            groupId: that.currentGroup.groupId,
            medias: that.replyObj.medias.length > 0 ? that.replyObj.medias : void 0,
            parentId: that.routeQuery('msgId'),
            status: '1',
            type: '1182',
            ...that.commonMessage()
          }
        }
        reqBody.message.refId = new Date().getTime()
        Api.addModelEssay(reqBody).then(res => {
          if (res && res.code === '1') {
            that.childList.unshift(res.messages[0])
            that.replyObj = {
              content: '',
              medias: []
            }
          }
        })
      },
      onScrollEnd(staus) {
        let that = this
        if (that.chaildHasNext > 0) {
          that.loadChildList()
        }
      },
      loadChildList() {
        Api.getDetaillist(this.currentGroup.groupId, this.routeQuery('msgId'), '1181', this.childCurPage).then(res => {
          if (res && res.code === '1') {
            if (res.hasNextPage > 0) {
              this.chaildHasNext = res.hasNextPage
              this.childCurPage = res.currentPage
            } else {
              this.chaildHasNext = 0
            }
            res.messages ? this.childList = [...this.childList, ...res.messages] : this.childList = []
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .model-essay {
    &-content {
      padding: rem(10);
    }
    &-author {
      text-align: center;
      padding-bottom: rem(10);
    }
    &-list {
      background-color: nth($background, 1);
    }
  }

</style>
