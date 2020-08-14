<template>
  <div class="medal-01"
       :class="{'flunk': md.score <= 0}"
       @click="handle">
    <div class="md-entirety">
      <div class="md-logo">
        <img :src="Image.IMG_EMPTY"
             v-lazy:background-image="logo"
             :style="imageStyle(logo)" />
      </div>
      <div class="md-content">
        <div class="md-name">{{md.name}}</div>
        <div class="md-description">{{md.parentName}}&nbsp;<span class="md-score">{{md.value}}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'medal',
    props: {
      medal: { type: [Object] }
    },
    components: {},
    computed: {
      md() {
        return this.medal
      },
      logo() {
        return this.url(this.medal.logo)
      }
    },
    methods: {
      handle() {
        this.$emit('click')
      }
    }
  }
</script>
<style lang="scss">
  .medal-01 {
    float: left;
    margin: 0 rem(5) rem(5) 0;
    cursor: pointer;
    width: rem(200);
    .md-entirety {
      height: rem(75);
      position: relative;
      overflow: hidden;
      width: rem(200);
      border-radius: rem(5);
      display: table;
      @include borderColor;
      .md-logo {
        width: rem(80);
        height: 100%;
        display: table-cell;
        vertical-align: middle;
        img {
          display: block;
          // vertical-align: middle;
          width: rem(45);
          height: rem(45);
          margin: 0 auto;
        }
      }
      .md-content {
        height: 100%;
        display: table-cell;
        vertical-align: middle;
        .md-name {
          color: #333;
        }
        .md-description {
          color: #969696;
        }
        .md-score {
          @include fc;
        }
      }
    }
    &.flunk {
      .md-entirety {
        border-color: red !important;
      }
      .md-score {
        color: red !important;
      }
    }
  }
</style>
