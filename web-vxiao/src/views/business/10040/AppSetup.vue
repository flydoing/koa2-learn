<template>
  <Setup>
    <template slot="others">
      <div v-if="isEducation">
        <item @click="targetSetting">
          <div slot="main">目标设置</div>
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
      // 目标设置
      targetSetting() {
        this.routePush({
          name: 'targetSetting10040'
        })
      },
      inputFormTemplate() {
        this.routePush({
          name: 'inputFormTemplate10040'
        })
      }
    }
  }
</script>
