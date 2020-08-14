<template>
  <page title="听写详情"
        @scrollEnd="scrollEnd">
    <!-- <div slot="btn" v-if="routeQuery('type')==='2'" @click="achievementClick">
      <label>成绩</label>
    </div> -->
    <div class="dictation-detail">
      <div v-if="routeQuery('type') === '1'"
           class="dictation-detail-online">
        <!-- 在线听写 -->
        <item @click="itemClick">
          <div>{{praxis.describe}}</div>
          <div slot="remark">{{praxis.remark}}</div>
        </item>
        <template v-if="praxis.datas.length>0">
          <div class="dictation-detail-online-content"
               v-for="(data, d) in praxis.datas"
               :key="d">
            <div class="header">{{data.name}}</div>
            <div class="questions"
                 v-if="data.datas.length > 0">
              <div v-for="(question, q) in data.datas"
                   :key="q"
                   @click="questionClick(question,data.type)">
                <div class="value">{{question.value + '%'}}</div>
                <p class="question-name">{{question.name}}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-else
           class="dictation-detail-underline">
        <!-- 线下听写 -->
        <div class="category-title">听写内容</div>
        <template v-if="dictationquestions.length>0">
          <div class="dictation-detail-underline-content"
               v-for="(question, c) in dictationquestions"
               :key="c">
            内容{{c+1}}：{{question.explain}}
          </div>
        </template>
        <div class="category-title">答卷</div>
        <div class="dictation-detail-underline-child"
             v-if="messages.length>0">
          <CardList :messages="messages"></CardList>
          <!--  <card12801 v-if="children.length>0" v-for="(m, k) in children" :message="m" :key="k"></card12801> -->
        </div>
        <CardTips text="暂无答卷"
                  v-else></CardTips>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  import MsgApi from '@/api/message'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    data() {
      return {
        mainMsg: [],
        children: [],
        dictationquestions: [],
        praxis: {}
      }
    },
    created() {
      const that = this
      // 线下听写
      if (that.routeQuery('type') === '2') {
        MsgApi.getMessageById(that.routeQuery('msgId'))
          .then(res => {
            that.mainMsg = res.message
            that.dictationquestions = JSON.parse(that.mainMsg.extensionType).questions
          })
          .catch(res => {})
        that.loadMessages()
      } else {
        // 在线听写
        Api.loadOnlineDetail(this.routeQuery('msgId'))
          .then(res => {
            that.praxis = res.praxis
          })
          .catch(res => {})
      }
    },
    methods: {
      loadMessages() {
        const that = this
        this.getMessages({
          groupId: that.currentGroup.groupId,
          currentPage: that.currentPage,
          queryType: 'parentId',
          parentId: that.routeQuery('msgId'),
          type: '1208'
        })
          .then(res => {})
          .catch(res => {})
      },
      itemClick() {
        this.routePush({
          name: 'onlineRanking1208',
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      },
      achievementClick() {},
      questionClick(question, type) {
        this.routePush({
          name: 'CorrectRate1208',
          query: {
            questionId: question.id,
            type: type,
            praxisId: this.praxis.id
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .dictation-detail {
    &-online {
      &-content {
        padding: rem(10);
        border-top: rem(10) solid #ededed;
        .header {
          line-height: 40px;
          min-height: 40px;
          position: relative;
          padding-left: 25px;
          &:before {
            position: absolute;
            content: '';
            width: rem(10);
            left: 0;
            top: rem(8);
            height: rem(25);
            @include bc;
          }
        }
        .questions {
          @include flex;
          flex-wrap: wrap;
          div {
            margin: 0 rem(10);
            margin-bottom: rem(5);
            cursor: pointer;
            &:hover {
              background-color: #f5f5f5;
            }
            .value {
              margin: 0 auto;
              height: rem(60);
              width: rem(60);
              border-radius: rem(60);
              border: rem(1) solid #ededed;
              line-height: rem(60);
              text-align: center;
              @include fc;
            }
            .question-name {
              line-height: rem(25);
              text-align: center;
              font-weight: 700;
              color: #444;
            }
          }
        }
      }
    }
    &-underline {
      &-content {
        height: rem(42);
        line-height: rem(42);
        padding: 0 rem(10);
        border-bottom: 1px solid #edeeed;
      }
      &-child {
        background-color: #ededed;
      }
    }
  }
</style>
