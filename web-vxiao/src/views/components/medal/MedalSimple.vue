<template>
  <div class="medal-simple">
    <div class="ms-entirety">
      <div class="ms-logo">
        <img :src="Image.IMG_EMPTY"
             v-lazy:background-image="medal.logo"
             :style="imageStyle(medal.logo)" />
      </div>
      <div class="ms-content">
        <div class="ms-name">{{medal.name}}</div>
        <div class="ms-description">{{medal.description}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'medalSimple',
    props: {
      medal: { type: [Object] }
    },
    created() {
      this.fetchData()
    },
    components: {},
    data() {
      return {}
    },
    computed: {},
    methods: {
      handle() {
        this.$emit('click')
      },
      fetchData() {
        let md = this.medal
        this.medal.logo = this.url(md.logo)
        this.medal.description = md.parentName.concat(' ').concat(md.value)
      }
    }
  }
</script>
<style lang="scss">
  .medal-simple {
    display: inline-block;
    margin-right: rem(10);
    .ms-entirety {
      height: rem(75);
      position: relative;
      overflow: hidden;
      width: rem(200);
      border-radius: rem(5);
      display: table;
      margin-top: rem(5);
      @include borderColor;
      .ms-logo {
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
      .ms-content {
        height: 100%;
        display: table-cell;
        vertical-align: middle;
        .ms-name {
          color: #333;
        }
        .ms-description {
          color: #969696;
        }
      }
    }
  }
</style>
