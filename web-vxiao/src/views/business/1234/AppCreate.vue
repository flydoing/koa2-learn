<template>
  <page title="新建调代课"
        closePrompt>
    <item @click="exchangeCourse">
      <div slot="main">
        <div>新建调课</div>
      </div>
    </item>
    <item @click="substituteCourse">
      <div slot="main">
        <div>新建代课</div>
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
      exchangeCourse() {
        this.routePush({
          name: 'exchangeCourse1234'
        })
      },
      substituteCourse() {
        this.routePush({
          name: 'substituteCourse1234'
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
