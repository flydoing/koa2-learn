<template>
  <Setup>
    <template slot="others">
      <div v-if="isEducation">
        <item @click="budgetManager">
          <div slot="main">预算管理</div>
          <div slot="remark"></div>
        </item>
        <item @click="inputFormTemplate">
          <div slot="main">输入表模</div>
          <div slot="remark"></div>
        </item>
      </div>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Api from './api'
  // import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {}
    },
    created() {},
    computed: {},
    methods: {
      // 预算管理
      budgetManager() {
        this.routePush({
          name: 'budgetManage10039'
        })
      },
      inputFormTemplate() {
        this.routePush({
          name: 'inputFormTemplate10039'
        })
      }
    }
  }
</script>
