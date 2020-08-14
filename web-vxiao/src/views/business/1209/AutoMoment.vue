<template>
  <page title="自动全景瞬间">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleMoment(item)">
      <div slot="main"
           v-html="item.title"></div>
      <div slot="remark">{{item.description}}，{{item.startTime}}</div>
    </item>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main">新增</div>
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
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        panomara: 'getPanomara'
      })
    },
    methods: {
      ...mapActions(['setPanomara']),
      fetchData() {
        const that = this
        Api.loadAutoMoments(that.currentGroup.parentId).then(res => {
          that.list = res.autoVRs || []
        })
      },
      handleMoment(item) {
        this.setPanomara({ cache: item, moment: null })
        this.routePush({ name: 'momentEdit1209' })
      },
      handleAdd() {
        this.setPanomara({ cache: null, moment: null })
        this.routePush({ name: 'momentEdit1209' })
      }
    }
  }
</script>
