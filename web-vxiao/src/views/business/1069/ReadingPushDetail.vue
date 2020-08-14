<template>
  <page title="详情">
    <div slot="btn">
      <label @click="handlePush">推送</label>
    </div>
    <div class="preview-main">
      <div class="preview-title"
           v-if="reading.title">{{reading.title}}</div>
      <div class="preview-content"
           v-html="reading.content"
           v-if="reading.content"
           @click="annotationDetail($event)"></div>
      <div class="category-title"></div>
      <div class="question-list">
        <template v-if="reading.questions.length > 0">
          <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                        class="praxis"
                        v-for="(question, q) in reading.questions"
                        :key="q"
                        :question="question"
                        :serial="q"
                        :isFromPraxis="false" />
        </template>
      </div>
    </div>
  </page>
</template>
<script>
  import Mixin1047 from '@/views/business/1047/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import G from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [G, Mixin1047, MixinMessage],
    data() {
      return {
        reading: {
          title: '',
          content: '',
          questions: []
        }
      }
    },
    created() {
      Api.getPushCardDetail(this.routeQuery('pushId')).then(res => {
        this.reading = res.praxis
      })
    },
    methods: {
      annotationDetail(event) {
        if (event.target.nodeName === 'SPAN') {
          let index = Number(event.target.getAttribute('k'))
          this.setStorage('annotation', this.reading.messages[index])
          this.routePush({
            name: 'annotation1069',
            query: {
              k: index
            }
          })
        }
      },
      handlePush() {
        this.addMessage({
          groupId: this.currentGroup.groupId,
          msgJson: JSON.stringify({
            id: this.routeQuery('pushId')
          }),
          title: this.reading.title,
          msgType: 'push',
          type: '1069',
          ...this.constructionMessage()
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack(-4)
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .preview-main {
    .preview-title {
      padding: rem(10);
      font-size: rem(16);
    }

    .preview-content {
      padding: 0 rem(10) rem(10);

      .postil {
        @include fc;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
</style>
