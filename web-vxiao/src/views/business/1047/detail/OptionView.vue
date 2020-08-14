<template>
  <div>
    <template v-if="options.length>0">
      <div class="option-box"
           v-for="(option, o) in options"
           :key="o">
        <!-- 有颜色 -->
        <item v-if="isShowResult"
              :noborder="true"
              :hasClick="itemClickAble()"
              @click="optionClick(option)">
          <div slot="before"
               :class="{'corrent-color':getIsCorrent(option)}">
            <span v-if="questionType==='6'||questionType==='7'">{{getSerial(o)}}.</span>
            <span v-else-if="questionType==='12'">{{ `第${o+1}空`}}.</span>
            <span v-else></span>
          </div>
          <div slot="main"
               v-html="option.content"
               :class="{'corrent-color':getIsCorrent(option)}"></div>
          <div slot="remark"
               class="error-text"
               :class="{'corrent-color':getIsCorrent(option)}"
               v-if="!isAnaly">
            {{option.joinCount || 0}}人，{{option.proportion || 0}}%
          </div>
        </item>
        <!-- 无颜色 -->
        <item v-if="!isShowResult"
              :noborder="true"
              :hasClick="itemClickAble()"
              @click="optionClick(option)">
          <div slot="before">
            <span v-if="questionType==='6'||questionType==='7'">{{getSerial(o)}}.</span>
            <span v-else-if="questionType==='12'">{{ `第${o+1}空`}}.</span>
            <span v-else></span>
          </div>
          <div slot="main"
               v-html="option.content"></div>
          <div slot="remark"
               v-if="!isAnaly">
            {{option.joinCount || 0}}人，{{option.proportion || 0}}%
          </div>
        </item>
      </div>
      <div @click="handleShowResult"
           class="eye-readed">查看答案<i class="ico ico-readed" /></div>
    </template>
  </div>
</template>
<script>
import G from '@/views/group/mixin'
import Mixin1047 from '@/views/business/1047/mixin'
export default {
  mixins: [G, Mixin1047],
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
    },
    isFromPraxis: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowResult: false
    }
  },
  methods: {
    handleShowResult() {
      this.isShowResult = !this.isShowResult
    },
    optionClick(option) {
      if (option.serialNumber && (option.joinCount === 0 || !option.joinCount)) {
        this.$message({
          type: 'warning',
          message: '暂无人选择该选项'
        })
        return false
      }
      this.routePush({
        name: 'answerUsers1047',
        query: {
          praxisId: this.praxisId,
          optionId: option.id,
          questionType: this.questionType
        }
      })
    },
    getIsCorrent(option) {
      return option.isCorrent === 1 || option.selected
    },
    itemClickAble() {
      return !this.isAnaly && this.isTeacher && this.isFromPraxis
    }
  }
}
</script>
<style lang="scss">
  @import '~scss/mixin';
  .option-box {
    padding-left: rem(10);
    .error-text {
      color: red;
    }
    .corrent-color {
      @include fc;
    }
  }
  .eye-readed {
    @include fc;
    cursor: pointer;
    padding: 0 10px 10px;
  }
</style>
