<template>
  <page title="微信同步菜单"
        @add="handleAdd"
        :hasAdd="true">
    <div class="wechat-menu">
      <template v-for="(item, i) in list">
        <item :key="i"
              :item="item"
              @click="handleItem(item)"
              v-if="item.name">
          <div slot="main"
               v-html="item.name"></div>
        </item>
      </template>
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
      fetchData() {
        const that = this
        Api.getWechatMenus(that.currentGroup.groupId).then(res => {
          that.list = res.weiXinMenus || []
        })
      },
      handleAdd() {
        this.setCreateObject({ menu: null })
        this.routePush({ name: 'wechatMenuEdit1011' })
      },
      handleItem(item) {
        this.setCreateObject({ menu: { ...item.menu, subMenus: item.subMenus } })
        this.routePush({ name: 'wechatMenuEdit1011' })
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
