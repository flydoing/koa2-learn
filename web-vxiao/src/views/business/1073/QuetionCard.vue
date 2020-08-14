<template>
  <div class="quetion">
    <div class="quetion-title">
      <span>{{serail+1}}.</span>
      <span v-html="quetion.title"></span>
    </div>
    <template v-if="quetion.type==='6' || quetion.type==='7'">
      <!-- 单选/多选 -->
      <div class="quetion-options">
        <item :hasClick="false"
              v-if="quetion.options.length>0"
              v-for="(option, o) in quetion.options"
              :key="o">
          <div class="option">{{option.serialNumber}}.&nbsp;
            <span v-html="option.content"></span>
          </div>
        </item>
      </div>
    </template>
    <template v-else-if="quetion.type==='8'"></template>
    <template v-else-if="quetion.type==='12'"></template>
    <template v-else-if="quetion.type==='14'"></template>
    <template v-else-if="quetion.type==='16'">
      <!-- 连线题 -->
      <div class="quetion-options">
        <div class="option-left left">
          <div v-for="(option, o) in quetion.options.filter(option=>{return option.sort === 1})"
               :key="o">{{option.content}}</div>
        </div>
        <div class="option-right right">
          <div v-for="(option, o) in quetion.options.filter(option=>{return option.sort === 2})"
               :key="o">{{option.content}}</div>
        </div>
      </div>
    </template>
    <div class="quetion-counter">
      <span class="is-click"
            @click.stop="analyClick">查看解析</span>
      <span>出过{{quetion.useCount}}次</span>
      <span>正确率：{{quetion.rightRate}}%</span>
      <span class="delete"
            v-if="routeQuery('isDelete')"
            @click="delectQuestion">删除</span>
    </div>
  </div>

</template>
<script>
  export default {
    props: {
      quetion: {
        type: Object,
        default: null
      },
      serail: {
        type: [Number],
        default: 0
      }
    },
    methods: {
      delectQuestion() {
        this.$emit('deleteQuestion')
      },
      analyClick() {
        this.$emit('analysis', this.quetion)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .quetion {
    padding: rem(10);
    &-title {
      @include flex;
    }
    &-options {
      @extend %clearfix;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
      .option-left,
      .option-right {
        div {
          min-width: rem(120);
          max-width: rem(240);
          margin-top: rem(5);
          padding: rem(10);
          text-align: center;
          border: $border;
        }
      }
      .option {
        @include flex;
      }
    }
    &-counter {
      margin-top: rem(15);
      font-size: rem(14);
      color: #9f9f9f;
      @extend %clearfix;
      span {
        margin-right: rem(10);
        &.is-click {
          color: #2dbe60;
        }
        &.delete {
          float: right;
          cursor: pointer;
        }
      }
    }
  }
</style>
