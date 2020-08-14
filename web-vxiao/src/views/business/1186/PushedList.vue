<template>
  <div class="pushed-list">
    <div class="pushed-box" v-for="(data, d) in datas" :key="d" v-if="data.datas">
      <div class="category-title text">
        <div>{{data.name}}</div>
        <div>{{data.extension}}</div>
      </div>
      <item v-for="(dt, _d) in data.datas" :key="_d">
        <div slot="main">{{dt.title}}</div>
        <div slot="remark">{{dt.extension}}</div>
      </item>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      datas: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .category-title {
    @include flex;
    justify-content: space-between;
  }

</style>
