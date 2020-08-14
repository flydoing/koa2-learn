<template>
  <Setup>
    <template v-if="isOrdinary && (isAdmin || isAppAdmin('1203'))"
              slot="others">
      <item @click="handlerManage">
        <div slot="main">负责人管理</div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {},
    computed: {},
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    methods: {
      handlerManage() {
        this.setStorage('_handler_manage_refresh', true)
        this.routePush({ path: '/vx/group/business/1203/handlerManage' })
      }
    }
  }
</script>
