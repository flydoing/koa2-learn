<template>
  <div>
    <template v-if="optionArr.length>0">
      <div class="option-box"
           v-for="(option, o) in optionArr"
           :key="o">
        <item :noborder="true"
              @click="optionClick(option)"
              :class="{'selected': option.selected}"
              v-if="option.serialNumber">
          <div slot="before"
               :class="optionStyle(option)">{{option.serialNumber}}</div>
          <div :class="optionStyle(option)"
               v-html="option.content"></div>
          <span slot="after"></span>
        </item>
        <div v-else
             class="option-box-fill">
          <i class="ico"
             :class="icoStyle(option)"
             v-if="routeQuery('pageType')!=='studentReply'"></i>
          第{{o+1}}空：
          <input type="text"
                 placeholder="输入答案"
                 v-model="option.content"
                 v-if="routeQuery('pageType')==='studentReply'">
          <div v-else>{{option.answerContent ? option.answerContent : option.content}}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import GroupMixin from '@/views/group/mixin'
  export default {
    mixins: [GroupMixin],
    props: {
      isAnaly: {
        type: Boolean,
        default: false
      },
      options: {
        type: Array,
        default() {
          return []
        }
      },
      praxisId: {
        type: [Number, String],
        default: null
      },
      questionType: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        optionArr: []
      }
    },
    created() {
      this.optionArr = [...this.options]
      // 当是填空题，并且是学生未回答的情况下，清空content
      this.questionType === '12' &&
        this.routeQuery('pageType') === 'studentReply' &&
        this.optionArr.forEach(o => {
          this.$set(o, 'content', '')
        })
    },
    methods: {
      optionClick(option) {
        // 学生查看答卷，选项不能点击
        if (this.routeQuery('pageType') === 'studentReview') {
          return false
        }
        if (this.questionType === '7') {
          // 多选
          let selected = !option.selected
          this.$set(option, 'selected', selected)
        } else if (this.questionType === '6' || this.questionType === '14') {
          // 单选、 判断题
          this.optionArr.forEach(o => {
            this.$set(o, 'selected', false)
            if (o.id === option.id) {
              this.$set(o, 'selected', true)
            }
          })
        }
      },
      optionStyle(option) {
        return [
          {
            // 当 是学生查看答卷 并且该选项是正确答案 的情况下 字体显示成绿色
            // 当 是学生查看答卷 并且该选项是正确答案 并且学生当前选中的为错误答案 的情况下 字体显示成红色，其他显示成灰色
            'corrent-color': this.routeQuery('pageType') === 'studentReview' && option.isCorrent === 1,
            'error-text': this.routeQuery('pageType') === 'studentReview' && option.selected && !option.isCorrent
          }
        ]
      },
      icoStyle(option) {
        return [
          {
            'ico-ziyuan5 error-text': option.isCorrent === 0,
            'ico-submit corrent-color': option.isCorrent === 1
          }
        ]
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .option-box {
    position: relative;
    padding-left: rem(10);
    .error-text {
      color: red;
    }
    .corrent-color {
      @include fc;
    }
    .selected {
      &:before {
        content: '';
        display: block;
        position: absolute;
        padding: rem(8) 0;
        border: 2px solid #ccc;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      &:after {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        bottom: -1px;
        right: -1px;
        border-radius: inherit;
        border: 0 solid #ccc;
        opacity: 0.6;
        animation: buttonEffect 0.4s;
        display: block;
      }
    }
    .vx-item {
      padding: rem(3) 0;
    }
    &-fill {
      @include flex;
      input {
        display: inline-block;
        width: rem(500);
        border: none;
        color: #444;
      }
      i {
        line-height: rem(20);
        font-size: rem(16);
      }
    }
  }
</style>
