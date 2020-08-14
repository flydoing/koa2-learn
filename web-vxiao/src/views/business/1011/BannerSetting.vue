<template>
  <page title="焦点图（Banner）"
        @add="handleAdd"
        :hasAdd="true">
    <div class="banner-setting">
      <item className="vx-item-show"
            v-for="(item, i) in list"
            :key="i"
            :item="item"
            @click="handleItem(item)">
        <div slot="main">
          <img class="bs-image"
               v-lazy="{src:toLogo(item.obj)}" />
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      toLogo(value) {
        return this.url(value)
      },
      fetchData() {
        const that = this
        Api.getBanners(that.currentGroup.groupId).then(res => {
          that.list = res.banners
        })
      },
      handleAdd() {
        this.routePush({ name: 'bannerEdit1011' })
      },
      handleItem(item) {
        this.setCreateObject({ banner: item })
        this.routePush({ name: 'bannerDetail1011' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banner-setting {
    .bs-image {
      width: rem(80);
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
      background: #ebebeb;
    }
  }
</style>
