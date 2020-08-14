<template>
  <page :title="title"
        hasSubmit
        @submit="submitHandle">
    <template v-for="(ladder, g) in stair.ladders">
      <item v-if="stair.ladders.length>0"
            :hasClick="false"
            :key="g">
        <div>评价{{ladder.grade}}</div>
        <div v-if="g<stair.ladders.length-1"
             slot="remark"
             class="remark-input">
          ≥
          <input type="text"
                 v-model="ladder.value"
                 maxlength="3"> 分
        </div>
        <div v-else
             slot="remark"
             class="remark-input">
          &lt;
          <input type="text"
                 v-model="ladder.value"
                 maxlength="3"> 分
        </div>
      </item>
    </template>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        stair: {},
        title: ''
      }
    },
    computed: {
      ...mapGetters({
        cacheInfo: 'getResultCreateInfo'
      })
    },
    created() {
      this.stair = JSON.parse(JSON.stringify(this.cacheInfo)).stairs[this.routeQuery('index')]
      this.title = `${this.stair.total}分制`
    },
    methods: {
      ...mapActions(['saveResultCreateInfo']),
      submitHandle() {
        let isRange = false
        isRange = this.stair.ladders.some(ladder => {
          return Number(ladder.value) > this.stair.total
        })
        if (isRange) {
          this.$message({
            type: 'warning',
            message: '分数不能超出总分范围'
          })
          return false
        }
        let stairs = JSON.parse(JSON.stringify(this.cacheInfo)).stairs
        stairs.splice(this.routeQuery('index'), 1, this.stair)
        let gradeText = ''
        stairs.forEach(stair => {
          stair.isSelect = false
        })
        this.stair.isSelect = true
        this.stair.ladders.forEach((ladder, l) => {
          l < this.stair.ladders.length - 1
            ? (gradeText = gradeText ? `${gradeText}，${ladder.grade} ≥ ${ladder.value}` : `${gradeText}${ladder.grade} ≥ ${ladder.value}`)
            : (gradeText = `${gradeText}，${ladder.grade} < ${ladder.value}`)
        })
        this.saveResultCreateInfo({
          stairs: [...stairs],
          gradeSetText: gradeText
        })
        this.routeBack(-2)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .remark-input {
    input {
      display: inline-block;
      width: 50px;
      min-width: 50px;
      text-align: center !important;
      padding: 0;
    }
  }
</style>
