<template>
  <div class="medal-03"
       :class="{'flunk': medal.score <= 0}"
       @click.stop="medalEdit">
    <div class="md-content">
      <div class="md-logo"
           v-lazy:background-image="logo"
           :style="imageStyle(logo)"></div>
      <div class="md-name"
           :class="nameClass">{{md.name}}</div>
      <div class="md-score">{{md.value}}</div>
      <div v-if="isRemove"
           class="md-remove"
           @click.stop="medalRemove"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'medal',
    props: {
      medal: { type: [Object] },
      isRemove: false
    },
    components: {},
    computed: {
      nameClass() {
        return `md-name ${this.medal.userId ? 'green' : 'blue'}`
      },
      logo() {
        return this.url(this.medal.logo)
      },
      md() {
        return this.medal
      }
    },
    methods: {
      medalEdit() {
        this.$emit('edit')
      },
      medalRemove() {
        this.$emit('remove')
      }
    }
  }
</script>
<style lang="scss">
  .medal-03 {
    float: left;
    margin: rem(8) rem(8) 0 0;
    width: rem(120);
    cursor: pointer;
    .md-content {
      width: rem(120);
      height: rem(126);
      cursor: pointer;
      padding-top: rem(24);
      position: relative;
      z-index: 998;
      border-radius: rem(8);
      @include borderColor;
    }

    .md-logo {
      width: rem(50);
      min-height: rem(50);
      height: rem(50);
      display: block;
      margin: auto;
    }
    .md-name {
      color: #333;
      margin-top: rem(13);
      text-align: center;
      height: rem(37);
      border-bottom-left-radius: rem(8);
      border-bottom-right-radius: rem(8);
      line-height: rem(37);
      &.blue {
        background: #9acdea;
      }
      &.green {
        background: #87c578;
      }
    }
    .md-score {
      position: absolute;
      right: rem(4);
      top: rem(4);
      color: #333;
    }
    .md-remove {
      position: absolute;
      right: rem(-15);
      top: rem(-15);
      color: red;
      font-size: rem(20);
      cursor: pointer;
      background-image: url($icon-url);
      background-repeat: no-repeat;
      background-position: rem(-720) rem(-68);
      height: rem(35);
      width: rem(38);
      z-index: 1000;
    }
    &.flunk {
      .md-content {
        border-color: red !important;
      }
    }
  }
</style>
