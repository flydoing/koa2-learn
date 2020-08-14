<template>
  <page title="听写详情" hasSubmit @submit="submitClick">
    <div class="student-reply">
      <div class="student-reply-header">
        {{startNum}}/{{questions.length}}，{{addZero(min)}}:{{addZero(second)}}
      </div>
      <audio :src="plyaSrc" controls="controls" autoplay="autoplay" class="student-reply-audio"></audio>
      <div class="list-button">
        <div class="button" @click="prev">上一题</div>
        <div class="button" @click="next">下一题</div>
      </div>
      <input v-if="routeQuery('type')==='1'" type="text" class="student-reply-answer" placeholder="输入听写内容" v-model="str">
    </div>
  </page>
</template>
<script>
  import MsgApi from '@/api/message'
  import M from '@/views/business/mixin'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [M, CardMixin],
    data() {
      return {
        questions: [],
        startNum: 1,
        second: 0,
        min: 0,
        plyaSrc: '',
        str: '',
        answers: [],
        extensionTypeId: null
      }
    },
    created() {
      const that = this
      MsgApi.getMessageById(this.routeQuery('msgId')).then(res => {
        this.questions = JSON.parse(res.message.extensionType).questions
        this.extensionTypeId = JSON.parse(res.message.extensionType).id
        this.plyaSrc = this.url(this.questions[0].medias[0].fileId)
        setInterval(() => {
          that.second++
            if (that.second > 59) {
              that.second = 0
              that.min += 1
            }
        }, 1000)
      }).catch(res => {})
    },
    methods: {
      addZero(str) {
        if (str <= 9) {
          return '0' + str
        } else {
          return str
        }
      },
      prev() {
        if (this.startNum <= 1) {
          this.startNum = 1
          return false
        } else {
          this.startNum -= 1
          this.plyaSrc = this.url(this.questions[this.startNum - 1].medias[0].fileId)
          this.answers[this.startNum] !== this.str ? this.answers[this.startNum] = this.str : this.answers = [
            ...this.answers
          ]
          this.str = this.answers[this.startNum - 1] || ''
        }
      },
      next() {
        if (this.startNum >= this.questions.length) {
          this.startNum = this.questions.length
          return false
        } else {
          this.plyaSrc = this.url(this.questions[this.startNum].medias[0].fileId)
          this.answers[this.startNum - 1] = this.str
          this.str = this.answers[this.startNum] || ''
          this.startNum += 1
        }
      },
      submitClick() {
        if (this.routeQuery('type') === '1') {
          // 在线
          this.str ? this.answers[this.startNum - 1] = this.str : this.answers = [...this.answers]
          let questionsArr = []
          this.questions.forEach((question, q) => {
            questionsArr.push({
              id: question.id,
              options: [{
                content: this.answers[q],
                id: question.options[0].id,
                spendTime: Number(this.min) * 60 + Number(this.second)
              }]
            })
          })
          let req = {
            groupId: this.currentGroup.groupId,
            parentId: this.routeQuery('msgId'),
            type: '120801',
            status: '1',
            msgJson: JSON.stringify({
              fromUserId: this.userId,
              id: this.extensionTypeId,
              msgId: this.routeQuery('msgId'),
              questions: questionsArr
            }),
            ...this.commonMessage()
          }
          MsgApi.addMessage(req).then(res => {
            res.messages && this.routeReplace({
              name: 'studentReview1208',
              query: {
                msgId: res.messages[0].id,
                userId: this.userId
              }
            })
          })
        } else {
          // 线下
          this.routePush({
            name: 'studentUnderLineReply1208',
            query: {
              msgId: this.routeQuery('msgId')
            }
          })
        }
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .student-reply {
    padding-top: rem(10);
    &-header {
      text-align: center;
      font-size: rem(14);
      color: #444;
    }
    &-audio {
      display: block;
      margin: rem(10) auto;
    }
    &-answer {
      display: block;
      margin-top: rem(10);
      padding: rem(10) 0;
      width: 100%;
      border: rem(1) solid #ededed;
      text-align: center;
    }
  }

</style>
