<template>
  <!-- 图片排序题 -->
  <div class="img-sort">
    <Titleview :title="question.title||question.content"
               :serial="serial"
               :isAnaly="isAnaly"></Titleview>
    <draggable v-if="routeQuery('pageType')==='studentReply'&&question.options.length>0"
               v-model="question.options"
               :class="directionStyle()">
      <!-- 学生 提交答卷 -->
      <div v-for="(option, o) in question.options"
           :key="o">
        <img v-lazy="{src:url(option.medias[0].fileId),error:Image.ICO_USER}"
             alt='排序图片'>
        <i class="ico ico-iosdrag"></i>
      </div>
    </draggable>
    <div v-if="routeQuery('pageType')==='studentReply'"
         class="text-color"
         style="text-align:center;"
         @click="suerSortClick">确定排序</div>
    <div v-else-if="routeQuery('pageType')==='studentReview'"
         :class="directionStyle()">
      <!-- 学生、家长查看答卷 -->
      <div v-for="(option, o) in question.options"
           :key="o">
        <img v-lazy="{src:url(option.medias[0].fileId),error:Image.ICO_USER}"
             alt='排序图片'>
      </div>
    </div>
    <div class="img-sort-content"
         v-else>
      <!-- 老师 查看答卷 -->
      <img v-lazy="{src:url(question.medias[0].fileId),error:Image.ICO_USER}"
           alt='排序图片'>
    </div>
    <item v-if="question.datas && !isAnaly"
          v-for="(data, d) in question.datas"
          :key="d"
          :noborder="true"
          @click="itemClick(data)">
      <div>{{data.key}}</div>
      <div slot="remark">{{data.value}}</div>
    </item>
    <AnalysisEnter :praxisId="praxisId"
                   :questionId="question.id"
                   :isAnaly="isAnaly"
                   v-if="showAnalyEnter()"
                   :quetionData="question"></AnalysisEnter>
    <div class="img-sort-readCount"
         v-if="showAcountBar()">已答{{question.joinCount}}</div>
  </div>
</template>
<script>
  import Mixin1047 from '../mixin'
  import Draggable from 'vuedraggable'
  import Api from '../api'
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
      directionStyle() {
        return [
          {
            transverseSort: this.question.direction === '1',
            verticalSort: this.question.direction === '2'
          }
        ]
      },
      suerSortClick() {
        const loading = this.$loading({
          text: '提交中',
          background: 'rgba(255, 255, 255, .3)'
        })
        let optionArr = []
        this.question.options.forEach((o, k) => {
          optionArr.push({
            id: o.id,
            medias: [...o.medias],
            sort: k + 1
          })
        })
        let reqBody = {
          praxis: {
            questions: [
              {
                direction: this.question.direction,
                id: this.question.id,
                options: optionArr,
                type: '13'
              }
            ]
          }
        }
        Api.commitImgSort(reqBody)
          .then(res => {
            loading.close()
            res.mergeLogo && this.$set(this.question, 'mergeLogo', res.mergeLogo)
          })
          .catch(res => loading.close())
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .img-sort {
    padding: 0 rem(10);
    &-content {
      img {
        max-width: rem(590);
      }
    }
    &-readCount {
      padding: 0 rem(10) rem(10);
    }
    .transverseSort {
      @include flex;
      @include jc;
      padding: 0 rem(10);
      div {
        margin: 0 rem(15);
        i {
          display: block;
          font-size: rem(30);
          margin-top: rem(10);
        }
      }
    }
    .verticalSort {
      div {
        @include flex;
        @include jc;
        @include ai;
        margin: rem(15) 0;
        i {
          font-size: rem(30);
        }
      }
    }
  }
</style>
