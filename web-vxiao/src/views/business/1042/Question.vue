<template>
  <div class="question-item"
       @click="handle">
    <div class='qi-content'>
      <slot name="name">
        <div class="qi-name"
             v-if="qt.name">{{qt.name}}</div>
      </slot>
      <div class="qi-medias"
           v-if="qt.medias && qt.medias[0]">
        <template v-if="qt.medias[0].type === 'photo'">
          <img class="qi-image"
               v-lazy="{'src':url(qt.medias[0].fileId)}" />
        </template>
        <template v-else>
          <div class="file-list">
            <a class="file-block"
               target="_blank"
               :href="url(qt.medias[0].fileId)">
              <div class="logo"><img :src="fileLogo(qt.medias[0])"
                     alt='头像'></div>
              <div class="title">{{qt.medias[0].fileName}}</div>
              <div class="remark">{{qt.medias[0].size | filterSize}}</div>
            </a>
          </div>
        </template>
      </div>
    </div>
    <div class="qi-options"
         v-if="qt.options">
      <template v-if="qt.type=='1' || qt.type=='2'">
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
            <div v-if="op.medias && op.medias[0]">
              <template v-if="op.medias[0].type === 'photo'">
                <img class="op-image"
                     v-lazy="{'src':url(op.medias[0].fileId)}" />
              </template>
              <template v-else>
                <div class="file-list">
                  <a class="file-block"
                     target="_blank"
                     :href="url(op.medias[0].fileId)">
                    <div class="logo"><img :src="fileLogo(op.medias[0])"
                           alt='头像'></div>
                    <div class="title">{{op.medias[0].fileName}}</div>
                    <div class="remark">{{op.medias[0].size | filterSize}}</div>
                  </a>
                </div>
              </template>
            </div>
            <div v-if="dp">{{op.joinCount}}人，{{op.percent}}%</div>
          </div>
        </div>
      </template>
      <template v-else-if="qt.type=='4'">
        <div class="op-item statistics"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op">
          <template v-if="joinIn">
            <div class="text-color"
                 v-html="qt.remark"></div>
          </template>
          <template v-else-if="isAnswer">
            <div class="op-value">
              <input type="text"
                     :placeholder="statisticsWarn(op.startValue,op.endValue)"
                     v-model="op.answerContent">
            </div>
            <div class="op-unit"
                 v-html="op.unit"></div>
          </template>
        </div>
      </template>
      <template v-else-if="qt.type=='5'">
        <div class="op-item marking"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op">
          <template v-if="joinIn">
            <div class="text-color"
                 v-html="qt.remark"></div>
          </template>
          <template v-else-if="isAnswer">
            <div class="op-score"
                 :class="{'active':it.selected}"
                 v-for="(it,j) in scoreItems"
                 :key="j"
                 :it="it"
                 v-html="it.score"
                 @click="handleScore(it)"></div>
          </template>
        </div>
      </template>
      <template v-else-if="qt.type=='3'">
        <div class="op-item"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op">
          <div v-if="joinIn"
               class="text-color"
               @click="handleEssay">已答内容</div>
          <TextInput v-else-if="isAnswer"
                     placeholder="输入答案"
                     v-model="op.answerContent" />
        </div>
      </template>
      <template v-else>
        <div class="op-item"
             v-for="(op,i) in qt.options"
             :key="i"
             :op="op">
          <div v-if="isAnswer"
               class="address-txt"
               v-html="addressTxt(op.answerContent)"></div>
          <div v-if="joinIn"
               class="text-color"
               @click.stop="handleLocation">查看定位</div>
        </div>
      </template>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import ArrayUtils from '@/utils/array'
  import FileUtils from '@/utils/file'

  export default {
    mixins: [R],
    props: {
      question: { type: [Object] },
      num: { type: [Number, String] },
      joinIn: { type: [Boolean] },
      isAnswer: { type: [Boolean] },
      canDo: { type: [Boolean] },
      upperLimit: { type: [Number, String] },
      display: { type: [Boolean] }
    },
    data() {
      return {
        type: {
          '1': '单选题',
          '2': '多选题',
          '3': '问答题',
          '4': '统计题',
          '5': '评分题',
          '19': '定位题'
        }
      }
    },
    computed: {
      qt() {
        let question = this.question
        if (this.upperLimit) {
          let limit = parseInt(this.upperLimit)
          question.type = limit > 1 ? '2' : '1'
        }
        question.name = `${this.num}、${question.title}（${this.type[question.type]}）`
        return question
      },
      scoreItems() {
        let items = []
        if (Check.isRealArray(this.question.options)) {
          let op = this.question.options[0]
          for (let i = 1; i <= op.startValue; i++) {
            items.push({
              score: i,
              selected: i === parseInt(op.answerContent)
            })
          }
        }
        return items
      },
      dp() {
        return this.display !== undefined ? this.display : this.joinIn
      }
    },
    methods: {
      choiceNum(index) {
        if (this.question.options.length < 11) {
          return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(index)
        }
        return index + 1
      },
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
            file.extension
          )
        ) {
          return '/static/f/icon_query@2x.png'
        }
        return `/static/f/icon_${file.extension}@2x.png`
      },
      addressTxt(content) {
        if (content) {
          let data = JSON.parse(content)
          return `${data.title}<br>${data.address}`
        }
        return !this.canDo ? '暂无地址' : '选择定位地址'
      },
      statisticsWarn(s, e) {
        return `${s}~${e}`
      },
      handle() {
        this.$emit('click', this.question, this.num)
      },
      handleChoice(op) {
        if (this.joinIn || !this.isAnswer || !this.canDo) {
          return false
        }
        if (this.qt.type === '1') {
          this.question.options = this.question.options.map(o => {
            if (o.id === op.id) {
              o.selected = !op.selected
            } else {
              o.selected = false
            }
            return o
          })
        } else {
          if (this.upperLimit && !op.selected) {
            let limit = parseInt(this.upperLimit)
            let opts = this.question.options.filter(o => {
              return o.selected
            })

            if (opts.length + 1 > limit) {
              this.$message({ message: '投票数已超上限', type: 'warning' })
              return false
            }
          }
          op.selected = !op.selected
        }
      },
      handleScore(item) {
        if (this.joinIn || !this.isAnswer) {
          return false
        }
        item.selected = !item.selected
        this.question.options[0].answerContent = item.selected ? item.score : ''
      },
      handleEssay() {
        this.routePush({
          name: 'answers1042',
          params: {
            qId: this.question.id
          },
          query: {
            msgId: this.routeParam('msgId')
          }
        })
      },
      handleLocation() {
        this.$emit('location', this.question)
      }
    },
    filters: {
      filterSize(size) {
        return FileUtils.getSize(size)
      }
    }
  }
</script>
<style lang="scss">
  .question-item {
    background: nth($background, 6);
    padding: rem(8) rem(8) 0;
    position: relative;
    color: nth($font-color, 1);
    cursor: pointer;
    .qi-content {
      padding: 0 0 rem(8);
      border-bottom: rem(1) solid #f9f9f9;
      .qi-medias {
        padding-top: rem(8);
      }
      img.qi-image {
        height: rem(90);
        display: block;
      }
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
            img.op-image {
              height: rem(90);
              display: block;
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

        &.statistics {
          overflow: hidden;
          display: table;
          width: 100%;

          .op-value {
            width: 90%;
            display: table-cell;
            vertical-align: middle;
          }

          .op-unit {
            text-align: right;
            width: 10%;
            vertical-align: middle;
            display: table-cell;
          }
        }

        &.marking {
          .op-score {
            width: rem(50);
            height: rem(50);
            border-radius: rem(50);
            border: rem(1) solid #ededed;
            text-align: center;
            line-height: rem(50);
            display: inline-block;
            cursor: pointer;
            margin: rem(8) 0;
            margin-right: rem(8);

            &:hover {
              background: #ededed;
            }
            &.active {
              @include bc;
              color: #fff;
            }
          }
        }

        .address-txt {
          padding: rem(5) 0;
        }

        .text-color {
          margin: rem(8) rem(10);
        }
      }
    }

    input {
      width: 100%;
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
