<template>
  <!-- 文字排序 -->
  <div class="text-sort">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <Draggable v-model="question.options"
               v-if="question.options.length>0&&routeQuery('pageType')==='studentReply'"
               class="text-sort-drag">
      <!-- 学生提交答卷 情况-->
      <div v-for="(option, o) in question.options"
           :key="o">
        {{option.content}}
        <i class="ico ico-iosdrag"></i>
      </div>
    </Draggable>
    <div v-if="question.options.length>0&&routeQuery('pageType')==='studentReview'"
         class="text-sort-student-review">
      <!-- 学生、家长查看答卷 -->
      <template v-if="question.options.length>0">
        <div v-for="(option, o) in question.options"
             :key="o"
             :class="optionStyle(option)">{{option.content}}</div>
      </template>
    </div>
    <div v-else
         class="text-sort-options">
      <!-- 老师查看答卷 -->
      <template v-if="question.options.length>0">
        <div v-for="(option, o) in question.options"
             :key="o">{{option.content}}</div>
      </template>
    </div>
    <template v-if="question.datas && !isAnaly">
      <item v-for="(data, d) in question.datas"
            :key="d"
            :noborder="true"
            @click="itemClick(data)">
        <div>{{data.key}}</div>
        <div slot="remark">{{data.value}}</div>
      </item>
    </template>
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="showAnalyEnter()"
                   :quetionData="question"></AnalysisEnter>
    <div class="text-sort-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import Mixin1047 from '../mixin'
  export default {
    mixins: [Mixin1047],
    components: {
      Draggable
    },
    props: {
      question: {
        type: Object,
        default() {
          return {}
        }
      },
      serial: {
        type: Number,
        default: null
      },
      praxisId: {
        type: [Number, String],
        default: null
      },
      isAnaly: {
        type: Boolean,
        default: false
      },
      isCompose: {
        type: Boolean,
        default: false
      },
      isFromPraxis: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      itemClick(data) {
        this.routePush({
          name: 'answerUsers1047',
          query: {
            questionId: this.question.id,
            type: data.type,
            questionType: this.question.type,
            titleText: data.key
          }
        })
      },
      optionStyle(option) {
        return option.isCorrent === 1 ? 'green' : 'red'
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .text-sort {
    padding: 0 rem(10);
    &-options {
      padding-left: rem(10);
      div {
        padding: rem(10);
      }
    }
    &-readCount {
      padding: 0 rem(10) rem(10);
    }
    &-drag {
      div {
        @include flex;
        @include ai;
        padding: rem(10);
        justify-content: space-between;
        i {
          font-size: rem(30);
          &:hover {
            color: #9f9f9f;
          }
        }
      }
    }
    &-student-review {
      div {
        padding: rem(10);
        &.green {
          @include fc;
        }
        &.red {
          color: red;
        }
      }
    }
  }
</style>
