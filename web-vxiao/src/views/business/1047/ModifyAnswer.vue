<template>
  <!-- 设置单选、多选和判断题的正确答案 -->
  <page title="正确答案" hasSubmit @submit="submitHandle">
    <item v-if="question.options.length>0" v-for="(option, o) in question.options" :key="o" @click="itemClick(option)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active': option.selected}"></i>
      </div>
      <template v-if="question.type==='14'">
        <div v-html="option.content"></div>
      </template>
      <template v-else>
        <div>{{getSerial(o)}}</div>
        <div slot="remark" v-html="option.content"></div>
      </template>
    </item>
  </page>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        question: null,
        isCompost: false // 是否是综合题
      }
    },
    computed: {
      ...mapGetters({
        cachePraxis: 'getPraxis',
        cacheReading: 'getReading'
      })
    },
    created() {
      if (this.routeQuery('appType') === '1047') {
        this.isCompost = this.cachePraxis.questions[this.routeQuery('index')].type === '15'
        if (this.isCompost) {
          this.question = JSON.parse(JSON.stringify(this.cachePraxis.questions[this.routeQuery('index')].questions[this.routeQuery('subIndex')]))
        } else {
          this.question = JSON.parse(JSON.stringify(this.cachePraxis.questions[this.routeQuery('index')]))
        }
      } else {
        this.isCompost = this.cacheReading.questions[this.routeQuery('index')].type === '15'
        if (this.isCompost) {
          this.question = JSON.parse(JSON.stringify(this.cacheReading.questions[this.routeQuery('index')].questions[this.routeQuery('subIndex')]))
        } else {
          this.question = JSON.parse(JSON.stringify(this.cacheReading.questions[this.routeQuery('index')]))
        }
      }
    },
    methods: {
      ...mapActions(['savePraxis', 'saveReading']),
      getSerial(i) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i)
      },
      submitHandle() {
        if (this.routeQuery('appType') === '1047') {
          let questions = JSON.parse(JSON.stringify(this.cachePraxis.questions))
          if (this.isCompost) {
            questions[this.routeQuery('index')].questions.splice(this.routeQuery('subIndex'), 1, this.question)
          } else {
            questions.splice(this.routeQuery('index'), 1, this.question)
          }
          this.savePraxis({
            questions: questions
          })
        } else {
          let questions = JSON.parse(JSON.stringify(this.cacheReading.questions))
          if (this.isCompost) {
            questions[this.routeQuery('index')].questions.splice(this.routeQuery('subIndex'), 1, this.question)
          } else {
            questions.splice(this.routeQuery('index'), 1, this.question)
          }
          this.saveReading({
            questions: questions
          })
        }
        this.routeBack()
      },
      itemClick(option) {
        if (this.question.type === '6' || this.question.type === '14') {
          // 单选
          this.question.options.forEach(o => {
            this.$set(o, 'selected', false)
            if (o.content === option.content) {
              this.$set(o, 'selected', true)
            }
          })
        } else if (this.question.type === '7') {
          // 多选
          let isSelect = !option.selected
          this.$set(option, 'selected', isSelect)
        }
      }
    }
  }

</script>
