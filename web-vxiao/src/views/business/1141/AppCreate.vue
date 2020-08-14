<template>
  <page title="选择对象">
    <div class="student-list">
      <item v-for="(item,i) in objects"
            :key="i"
            :item="item"
            @click="handleObject(item)">
        <div slot="before">
          <img class="avatar"
               v-lazy="{src:url(item.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="item.remark"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        objects: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setPrize']),
      fetchData() {
        const that = this
        Api.getChildren(that.groupId).then(res => {
          if (Check.isRealArray(res.relations)) {
            that.objects = res.relations
          }
        })
      },
      handleObject(item) {
        this.setPrize({ user: item })
        this.routePush({ name: 'exchangePrize1141' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .student-list {
    img {
      margin: rem(5) 0;
    }
  }
</style>
