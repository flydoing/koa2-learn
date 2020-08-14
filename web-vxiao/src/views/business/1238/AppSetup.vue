<template>
  <Setup appType="'1238'">
    <template slot="others">
      <item @click="universityLibrary">
        <div slot="main">默认接收人</div>
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
        this.routePush({ name: 'selectHandler1238' })
      }
    }
  }
</script>
