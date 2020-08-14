<template>
  <div class="apsl-question-item"
       @click="handle">
    <div class="qi-name">{{qt.name}}</div>
    <div class="qi-remark"
         v-if="question.selfAnswer"
         v-html="selfAnswerTxt"></div>
    <div class="qi-options">
      <template v-if="qt.type=='1' || qt.type=='4'">
        <div class="op-item choice"
             :class="{'active':op.selected}"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op"
             @click="handleChoice(op)">
          <div class="op-num"
               v-html="choiceNum(i)"></div>
          <div class="op-content">
            <div v-html="op.content"></div>
            <div class="text-color"
                 v-if="isSummary"
                 @click.stop="handleAnswer(op)">{{op.joinCount}}人，{{op.percentage}}</div>
          </div>
        </div>
      </template>
      <template v-else-if="qt.type=='5'">
        <div class="op-item marking"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op">
          <template v-if="isSummary">
            <div class="text-color"
                 v-html="summaryTxt"
                 @click.stop="handleAnswer"></div>
          </template>
          <template v-else-if="isAnswer">
            <item @click="handleAddRemark"
                  class="score-item">
              <div slot="main">
                <input class="min-input"
                       placeholder="必填"
                       v-model="op.content"
                       @click.stop /> 分
              </div>
              <div slot="remark"
                   v-html="remarkTxt"
                   class="ellipsis"></div>
            </item>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="op-item">
          <template v-if="isSummary">
            <div class="text-color"
                 @click.stop="handleAnswer">已答内容</div>
          </template>
          <template v-else-if="isAnswer">
            <TextInput placeholder="输入内容"
                       v-model="qt.options[0].content"></TextInput>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {
      question: { type: [Object] },
      num: { type: [Number, String] },
      isSummary: { type: [Boolean] },
      isAnswer: { type: [Boolean] }
    },
    computed: {
      qt() {
        let q = this.question
        if (q.type === '5') {
          let txt = q.options[0].score ? `最高${q.options[0].score}分` : '不限分'
          q.name = `${this.num}. ${q.title}（${txt}）`
        } else {
          q.name = `${this.num}. ${q.title}`
        }
        return q
      },
      remarkTxt() {
        return !Check.isNullString(this.question.remark) ? this.question.remark : '待备注'
      },
      summaryTxt() {
        let q = this.question
        let txt = q.selfAppraisalScore > 0 ? `自评${q.selfAppraisalScore}分，` : ''
        return `${q.joinCount}人已评，${txt}平均${q.avgScore}分（不含自评）`
      },
      selfAnswerTxt() {
        let type = this.question.type
        let answer = this.question.selfAnswer
        if (type === '1' || type === '4') {
          return `自选：${answer.content}`
        } else if (type === '5') {
          return `自评：${answer.content}分`
        }
        return `自评：${answer.content}`
      }
    },
    methods: {
      choiceNum(index) {
        if (this.question.options.length < 11) {
          return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(index)
        }
        return index + 1
      },
      handle() {
        this.$emit('click', this.question, this.num)
      },
      handleChoice(op) {
        if (this.isSummary || !this.isAnswer) {
          return false
        }
        this.question.options = this.question.options.map(o => {
          if (o.id === op.id) {
            o.selected = !op.selected
          } else {
            o.selected = false
          }
          return o
        })
      },
      handleAddRemark() {
        this.$emit('remark', this.question)
      },
      handleAnswer(op) {
        if (op && op.joinCount < 1) {
          return false
        }
        if (this.question.joinCount < 1) {
          return false
        }
        this.$emit('answer', this.question, op)
      }
    }
  }
</script>
<style lang="scss">
  .apsl-question-item {
    background: nth($background, 6);
    padding: rem(8) rem(8) 0;
    position: relative;
    color: nth($font-color, 1);
    .qi-name,
    .qi-remark {
      padding: 0 0 rem(8);
      border-bottom: rem(1) solid #f9f9f9;
      text-align: justify;
    }
    .qi-options {
      .op-item {
        &.choice {
          overflow: hidden;
          display: table;
          cursor: pointer;
          width: 100%;
          position: relative;
          .op-num {
            width: rem(40);
            vertical-align: middle;
            text-align: center;
            display: table-cell;
          }
          .op-content {
            padding: rem(8) 0;
            border-bottom: rem(1) solid #f9f9f9;
            & > div {
              margin: rem(4) 0;
            }
          }
          &:hover {
            background: #f9f9f9;
          }
          &.active:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: rem(10);
            @include bc;
          }
        }
        .text-color {
          margin: rem(8) rem(10);
        }
      }
    }
    .score-item {
      .vx-item-left > div {
        padding-left: 0;
      }
    }
    .min-input {
      width: rem(50);
      min-height: rem(40);
      padding: 0;
      border: 0;
    }
    textarea {
      width: 100%;
      min-height: rem(50);
      padding-top: rem(8);
      border: 0;
      resize: none;
    }
  }
</style>
