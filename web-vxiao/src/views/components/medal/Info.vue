<template>
  <Overlay :show.sync="visible"
           :width="300"
           :height="300"
           @close="handle">
    <div class="medal-info">
      <div v-if="medal.parentName"
           class="mi-title"
           v-html='medal.parentName'></div>
      <Medal :medal="medal"></Medal>
      <div class="mi-description"
           v-html='medal.description'></div>
    </div>
  </Overlay>
</template>
<script>
  export default {
    props: {
      show: { type: Boolean, default: false },
      medal: { type: Object }
    },
    data() {
      return { visible: this.show }
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal2'], resolve)
    },
    computed: {},
    methods: {
      handle() {
        this.$emit('update:show', false)
      }
    },
    watch: {
      show(val) {
        this.visible = val
      }
    }
  }
</script>
<style lang="scss">
  .medal-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: #fff;
    .mi-title {
      font-size: rem(18);
      margin-bottom: rem(15);
    }
    .mi-description {
      padding: rem(10);
      font-size: rem(14);
      text-align: justify;
      word-break: break-word;
    }
    .medal-02 {
      float: none;
    }
  }
</style>
