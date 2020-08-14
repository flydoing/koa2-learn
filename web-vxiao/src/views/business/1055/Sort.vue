<template>
  <Page title="报名信息排序"
        hasSubmit
        @submit="submit">
    <div v-for="(msgItem, i) in applyMsgList"
         :key="i"
         draggable="true"
         @dragstart="dragStart(i)"
         @dragend="dragEnd($event)"
         @drop="drop($event, i)"
         @dragover="dragOver($event)">
      <Item>
        <div>{{msgItem.key}}</div>
        <div slot="after">
          <i class="ico ico-drag f20" />
        </div>
      </Item>
    </div>
  </Page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        applyMsgList: [],
        curIndex: -1
      }
    },
    computed: {
      ...mapGetters({
        question: 'getQuestion'
      })
    },
    created() {
      if (this.question.enrollTable) {
        this.applyMsgList = this.question.enrollTable.metaDatas
        this.applyMsgList = this.applyMsgList.filter((item, index) => {
          if (item.extension) {
            return true
          }
        })
      }
    },
    methods: {
      ...mapActions(['saveQuestion']),
      dragStart(index) {
        this.curIndex = index
      },
      dragEnd(e) {
        return false
      },
      dragOver(e) {
        e.preventDefault()
        return true
      },
      drop(e, index) {
        let from = this.applyMsgList[this.curIndex]
        let to = this.applyMsgList[index]
        this.$set(this.applyMsgList, this.curIndex, { ...to, sort: from.sort })
        this.$set(this.applyMsgList, index, { ...from, sort: to.sort })
        return false
      },
      submit() {
        this.saveQuestion({
          enrollTable: {
            ...this.question.enrollTable,
            metaDatas: this.question.enrollTable.metaDatas,
            questionnaire: {
              questions: this.question.enrollTable.questionnaire.questions
            }
          }
        })
        this.routeBack(-2)
      }
    }
  }
</script>
