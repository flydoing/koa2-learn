<template>
  <page title="新建选课">
    <item @click="selection">
      <div slot="main">
        <div>选拔</div>
        <div class="remark-text">适用于选修课，中小学课程、兴趣班选拔</div>
      </div>
    </item>
    <item @click="electiveCourse">
      <div slot="main">
        <div>中高考选课</div>
        <div class="remark-text">适用于中考、高考选考科目选课</div>
      </div>
    </item>
  </page>
</template>
<script>
  // import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          content: ''
        }
      }
    },
    created() {},
    computed: {},
    methods: {
      selection() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1096',
            groupId: this.groupId
          }
        })
      },
      electiveCourse() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1138',
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .remark-text {
    font-size: rem(12);
    color: #999;
  }
</style>
