<template>
  <Setup appType="'1105'">
    <template slot="others">
      <item @click="universityLibrary">
        <div slot="main">群组借贷设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: (resolve) => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      universityLibrary() {
        this.routePush({ name: 'selectHandler1105' })
      }
    }
  }
</script>
