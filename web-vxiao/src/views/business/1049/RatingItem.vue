<template>
  <div v-if="way.type == 'point'"
       class="point-items">
    <item @click="handle(false, false, false)"
          :hasClick="canEdit">
      <div slot="main">
        <div v-html="item.name"></div>
        <div class="remark-txt"
             v-html="remarkTxt"></div>
      </div>
      <div slot="remark"
           class="ellipsis">{{pointTxt}}</div>
    </item>
  </div>
  <div v-else-if="way.type == 'score'"
       class="score-items">
    <template v-if="canEdit">
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleScore">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">
              <div v-html="item.name"></div>
              <div class="remark-txt"
                   v-html="remarkTxt"></div>
            </div>
            <div slot="remark"
                 class="ellipsis">{{scoreTxt}}</div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(s,k) in scores"
                            :key="k"
                            :s="s"
                            :command="s">{{s.value}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <item :hasClick="false">
        <div slot="main">
          <div v-html="item.name"></div>
          <div class="remark-txt"
               v-html="remarkTxt"></div>
        </div>
        <div slot="remark"
             class="ellipsis">{{scoreTxt}}</div>
      </item>
    </template>
  </div>
  <div v-else>
    <item :hasClick="false">
      <div slot="main">
        <div v-html="item.name"></div>
        <div class="remark-txt"
             v-html="remarkTxt"></div>
      </div>
      <div slot="remark">
        <div v-if="way.type == 'rank'"
             class="rank-items">
          <span v-for="(r,k) in item.ranks"
                :key="k"
                :r="r"
                @click="handle(r, k, $event)"
                :class="rankClass(r)"></span>
        </div>
        <div v-else-if="way.type == 'self'"
             class="custom-items">
          <span v-for="(c,k) in item.childs"
                :key="k"
                :c="c"
                v-html="c.name"
                @click="handle(c, k, $event)"
                :class="{'active':c.active}"></span>
        </div>
        <div v-else-if="way.type == 'star'"
             class="star-items">
          <span v-for="(s,k) in item.stars"
                :key="k"
                :s="s"
                class="star"
                :class="{'active':s.active, 'half-active':s.half}"
                @click="handle(s, k, $event)"></span>
        </div>
      </div>
    </item>
  </div>
</template>
<script>
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {
      way: { type: [Object] },
      item: { type: [Object] },
      canEdit: { type: [Boolean] }
    },
    components: {},
    created() {},
    computed: {
      scores() {
        let s = []
        if (this.item.rule) {
          for (let i = 0; i < this.item.rule.maxScore; i++) {
            s.push({
              value: i + 1
            })
          }
          return s
        }
        return []
      },
      scoreTxt() {
        return this.item.score !== '' ? `${this.item.score}分` : '评分'
      },
      pointTxt() {
        if (this.item.score !== '') {
          let s = this.item.score > 0 ? `+${this.item.score}` : this.item.score
          return `当日累计${s}分`
        }
        return '未评分'
      },
      remarkTxt() {
        let r = this.item.rating
        if (r.name) {
          let time = DateUtils.format(r.createTime, DateUtils.HM)
          return `${r.name}${time}评`
        }
        return ''
      }
    },
    methods: {
      rankClass(r) {
        return r.active ? `${r.name} active` : r.name
      },
      handleScore(data) {
        this.handle(data, false, false)
      },
      handle(data, index, $event) {
        if (this.canEdit) {
          this.$emit('click', $event, this.item, data, index)
        }
      }
    }
  }
</script>
<style lang="scss">
  .remark-txt {
    color: nth($font-color, 7);
    font-size: rem(12);
  }

  .rank-items {
    padding: rem(5) 0;

    span {
      width: rem(40);
      height: rem(40);
      display: inline-block !important;
      vertical-align: middle;
      margin-left: rem(10);
      cursor: pointer;

      &.excellent {
        background: url(~images/ico/ico_excellent_normal.png) no-repeat;
        background-size: 100%;

        &:hover,
        &.active {
          background: url(~images/ico/ico_excellent_press.png) no-repeat;
          background-size: 100%;
        }
      }

      &.fine {
        background: url(~images/ico/ico_fine_normal.png) no-repeat;
        background-size: 100%;

        &:hover,
        &.active {
          background: url(~images/ico/ico_fine_press.png) no-repeat;
          background-size: 100%;
        }
      }

      &.medium {
        background: url(~images/ico/ico_medium_normal.png) no-repeat;
        background-size: 100%;

        &:hover,
        &.active {
          background: url(~images/ico/ico_medium_press.png) no-repeat;
          background-size: 100%;
        }
      }

      &.bad {
        background: url(~images/ico/ico_bad_normal.png) no-repeat;
        background-size: 100%;

        &:hover,
        &.active {
          background: url(~images/ico/ico_bad_press.png) no-repeat;
          background-size: 100%;
        }
      }
    }
  }

  .custom-items {
    padding: rem(5) 0;

    span {
      width: rem(38);
      height: rem(38);
      display: inline-block !important;
      vertical-align: middle;
      margin-left: rem(10);
      cursor: pointer;
      border-radius: rem(38);
      text-align: center;
      line-height: rem(38);
      color: #909090;
      @include borderColor;

      &:hover,
      &.active {
        @include bc;
        color: nth($font-color, 4);
        @include borderColor;
      }
    }
  }

  .star-items {
    .star {
      display: inline-block;
      width: rem(18);
      height: rem(18);
      margin-left: rem(5);
      vertical-align: middle;
      cursor: pointer;
      background: url(~images/ico/ico_star.png) no-repeat center;
      background-size: 100%;

      &.active {
        background: url(~images/ico/ico_light_star.png) no-repeat center;
        background-size: 100%;
      }

      &.half-active {
        background: url(~images/ico/ico_half_star.png) no-repeat center;
        background-size: 100%;
      }
    }
  }
</style>
