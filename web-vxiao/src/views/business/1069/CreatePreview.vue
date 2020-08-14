<template>
  <page title="预览"
        hasSubmit
        listenBack
        @back="back"
        @submit="submitReading">
    <div class="reading-preview">
      <div class="category-title">选中文字，右键进行批注</div>
      <div class="preview-main">
        <div class="preview-title"
             v-html="cacheReading.title"
             v-if="cacheReading.title"></div>
        <div class="preview-content"
             v-html="text"
             v-if="text"
             @contextmenu.prevent="rightClick($event)"
             @click="annotationDetail($event)"></div>
        <div class="category-title"></div>
        <div class="question-list">
          <template v-if="questions.length > 0">
            <CommonPraxis :praxisType="getPraxiStyle(question.type)"
                          class="praxis"
                          v-for="(question, q) in questions"
                          :key="q"
                          :question="question"
                          :serial="q"
                          :isFromPraxis="false" />
          </template>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Mixin1047 from '@/views/business/1047/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import G from '@/views/group/mixin'
  export default {
    mixins: [MixinMessage, Mixin1047, G],
    data() {
      return {
        questions: [],
        text: null,
        // 批注内容
        postils: []
      }
    },
    computed: {
      ...mapGetters({
        cacheReading: 'getReading'
      })
    },
    created() {
      this.questions = [...this.cacheReading.questions]
      this.text = this.cacheReading.content
      this.postils = this.cacheReading.postils || []
    },
    methods: {
      ...mapActions(['saveReading', 'clearReading']),
      submitReading() {
        let questions = []
        this.cacheReading.questions.forEach((question, k) => {
          let temp = []
          if (question.type === '16') {
            question.options.forEach(optionArr => {
              optionArr.forEach(option => {
                temp.push(option)
              })
            })
          }
          questions.push({
            options: temp.length > 0 ? temp : question.options,
            title: question.content,
            type: question.type,
            explain: question.explain || void 0,
            medias: question.medias ? question.medias : void 0,
            direction: question.curDirection ? question.curDirection.value : void 0,
            spaceCount: question.curSpaceCount ? question.curSpaceCount : void 0,
            mediaType: question.type === '13' || question.type === '17' ? (question.type === '13' ? 2 : 1) : void 0
          })
          // 格式化综合题 提交内容
          let subQuestions = []
          question.questions &&
            question.questions.forEach(subQuestion => {
              let subTemp = []
              if (subQuestion.type === '16') {
                subQuestion.options.forEach(optionArr => {
                  optionArr.forEach(option => {
                    subTemp.push(option)
                  })
                })
              }
              subQuestions.push({
                options: subTemp.length > 0 ? subTemp : subQuestion.options,
                title: subQuestion.content,
                type: subQuestion.type,
                explain: subQuestion.explain || void 0,
                medias: subQuestion.medias ? subQuestion.medias : void 0,
                direction: subQuestion.curDirection ? subQuestion.curDirection.value : void 0,
                spaceCount: subQuestion.curSpaceCount ? subQuestion.curSpaceCount : void 0,
                mediaType: subQuestion.type === '13' || subQuestion.type === '17' ? (subQuestion.type === '13' ? 2 : 1) : void 0
              })
            })
          if (subQuestions.length > 0) {
            questions[k].questions = subQuestions
          }
        })
        this.addMessage({
          categoryId: this.isCourse ? this.cacheReading.category.id : void 0,
          categoryName: this.isCourse ? this.cacheReading.category.name : void 0,
          groupId: this.currentGroup.groupId,
          msgJson: JSON.stringify({
            praxis: {
              content: this.cacheReading.content,
              messages: this.cacheReading.postils,
              title: this.cacheReading.title,
              questions: questions
            }
          }),
          type: '1069',
          ...this.constructionMessage()
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack(-3)
          this.clearReading()
        })
      },
      rightClick(event) {
        const that = this
        let range = window.getSelection()
        let selected = range.toString()
        if (!selected) {
          return false
        }
        if (range.anchorNode.parentNode.tagName === 'SPAN') {
          that.$message({ type: 'warning', message: '该选区已有批注,请重新选择' })
          return false
        }
        let STrange = range.getRangeAt(0)
        if (range.anchorNode.data.substring(STrange.startOffset, STrange.endOffset) !== selected) {
          that.$message({ type: 'warning', message: '该选区已有批注,请重新选择' })
          range.removeAllRanges()
          return false
        }
        // let text = range.anchorNode.data
        let text = that.text.replace(/<p>|<\/p>/g, '')
        let length = text.length
        let startIndex = STrange.startOffset
        let endIndex = STrange.endOffset
        let startText = text.substring(0, startIndex)
        let endText = text.substring(endIndex, length)
        // this.text = '<p>' + startText + `<span class="postil">${selected}</span>` + endText + '</p>'
        that.text = `${startText}<span class="postil" k="${that.postils.length}">${selected}</span>${endText}`
        that.addPostil(selected, null)
      },
      addPostil(str, index) {
        this.saveReading({
          content: this.text,
          postils: this.postils
        })
        this.routePushModel({
          name: 'modifyPostil1069',
          query: {
            index: index || void 0,
            text: str
          }
        })
      },
      annotationDetail(event) {
        if (event.target.nodeName === 'SPAN') {
          let index = Number(event.target.getAttribute('k'))
          this.setStorage('annotation', this.cacheReading.postils[index])
          this.routePush({
            name: 'annotation1069',
            query: {
              k: index
            }
          })
        }
      },
      back() {
        const that = this
        that
          .$confirm('批注将会丢失，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            let text = this.text.replace(/<[^>]+>/g, '')
            this.saveReading({
              content: text,
              postils: []
            })
            that.routeBack()
          })
          .catch(() => {})
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .reading-preview {
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
  }
</style>
