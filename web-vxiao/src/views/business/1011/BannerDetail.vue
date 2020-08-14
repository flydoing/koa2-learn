<template>
  <page title="Banner详情">
    <div class="banner-detail">
      <img v-if="banner"
           v-lazy="{src:logo}" />
      <div class="button button-common"
           @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        banner: null
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      }),
      logo() {
        return this.banner.obj ? this.url(this.banner.obj) : ''
      }
    },
    methods: {
      ...mapActions(['getCreateObject']),
      fectchData() {
        if (this.active.banner) {
          this.banner = this.active.banner
        }
      },
      handleRemove() {
        let banner = this.banner
        Api.removeBanner({
          groupId: this.currentGroup.groupId,
          banner: { ...banner, status: 'd' }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banner-detail {
    img {
      display: block;
      margin: rem(10) auto;
      min-width: 90%;
      max-width: 90%;
    }
  }
</style>
