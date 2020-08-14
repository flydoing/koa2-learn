<template>
  <page title="新建图书">
    <item @click="handleDonate">
      <div slot="main">
        <div>捐书</div>
      </div>
    </item>
    <template v-if="isAdmin || isAppAdmin('1150')">
      <item @click="handleStorage">
        <div slot="main">
          <div>入库</div>
        </div>
      </item>
      <item @click="handleAbandoned">
        <div slot="main">
          <div>报废</div>
        </div>
      </item>
    </template>
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
      handleDonate() {
        this.routePush({
          name: 'addBook1150',
          query: {
            appType: '115002'
          }
        })
      },
      handleStorage() {
        this.routePush({
          name: 'addBook1150',
          query: {
            appType: '115006'
          }
        })
      },
      handleAbandoned() {
        this.routePush({
          name: 'abandonedBook1150'
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
