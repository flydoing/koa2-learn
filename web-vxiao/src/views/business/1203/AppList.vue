<template>
  <page title="应用负责人">
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.name"
          :remark="userTxt(item)"
          @click="handleApp(item, i)">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: [],
        active: 1
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      Api.getApps(this.groupId, false, true).then(res => {
        this.list = res.categorys || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      userTxt(app) {
        if (app.metaDatas) {
          let us = app.metaDatas.map(v => {
            return v.obj
          })
          return us.join('、')
        }
        return ''
      },
      handleApp(item, i) {
        this.routePush({
          path: '/vx/group/business/1203/handlers',
          query: { appId: item.id }
        })
      }
    }
  }
</script>
<style lang="scss">
  .app-list {
    .vx-item {
      &.is-click:hover {
        background: #fff;
      }
      cursor: pointer;
    }
    .el-collapse {
      border-top: 0 !important;
    }
    .el-collapse-item__content {
      padding-bottom: 0 !important;
      & > div:last-child {
        &:after {
          height: 0;
        }
      }
    }
  }
</style>
