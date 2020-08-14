<template>
  <div class="commendation"
       @click="handle">
    <i class="ico ico-select active"
       v-show="cm.active"></i>
    <img :src="Image.IMG_EMPTY"
         v-lazy:background-image="logo"
         :style="imageStyle(logo)" />
    <div class="cmdn-content">
      <slot name="content">
        <span>&#12288;&#12288;
          {{cm.member}}
          <a v-if="cm.mCount && cm.member.length > 20"
             @click="handleMember">等{{cm.mCount}}人</a>
          {{cm.content}}
        </span>
      </slot>
    </div>
    <div class="cmdn-tag">
      <slot name="tag">
        <div>{{cm.groupName}}</div>
        <div>{{cm.date}}</div>
      </slot>
    </div>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {
      commendation: { type: [Object] }
    },
    computed: {
      ...mapGetters({
        commend: 'getCommend'
      }),
      logo() {
        return this.url(this.cm.logo)
      },
      cm() {
        return this.commendation
      }
    },
    methods: {
      ...mapActions(['setCommend']),
      handle() {
        this.$emit('click')
      },
      handleMember() {
        if (Check.isRealArray(this.cm.users)) {
          this.setCommend({ members: this.cm.users })
          this.routePushModel({ name: 'memberList1048' })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/_mixin';
  .commendation {
    cursor: pointer;
    position: relative;
    width: rem(412);
    height: rem(232);
    margin: rem(5) 0;
    .ico-select {
      position: absolute;
      right: 0;
      top: rem(5);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .cmdn-content {
      position: absolute;
      width: rem(312);
      height: rem(100);
      top: 50%;
      left: 50%;
      margin-left: rem(-156);
      margin-top: rem(-50);
      font-size: rem(16);
      text-align: justify;
      word-break: break-word;
      color: #000;
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      & > span {
        display: inline-block;
        vertical-align: middle;
      }
      a {
        color: #2dbe60;
        cursor: pointer;
        display: inline-block;
      }
    }
    .cmdn-tag {
      position: absolute;
      bottom: rem(24);
      right: rem(50);
      font-size: rem(12);
      text-align: right;
      line-height: rem(18);
      color: #000;
    }
  }
</style>
