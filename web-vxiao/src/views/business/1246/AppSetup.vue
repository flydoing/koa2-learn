<template>
  <Setup appType="'1246'">
    <template slot="others">
      <Item @click="onBannar">
        <div>{{isSchool ? '校训校徽' : '班训班徽'}}</div>
      </Item>
      <div class="category-title"></div>
      <Item @click="onCategory">
        <div>类型管理</div>
      </Item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      onBannar() {
        this.routePush({
          path: '/vx/group/business/1246/setup/bannar'
        })
      },
      onCategory() {
        this.routePush({
          path: '/vx/group/business/1246/setup/categorys',
          query: { schoolId: this.currentGroup.parentId }
        })
      }
    }
  }
</script>
