<template>
  <page title="新建体测"
        closePrompt>
    <div class="physical-Test-create">
      <item @click="projectSetting">
        <div slot="main">体测项目设置</div>
        <div slot="remark">{{count}}项</div>
      </item>
      <!-- <item @click="exportGrades">
        <div slot="main">导出成绩</div>
        <div slot="remark"></div>
      </item> -->
      <item @click="importGrades">
        <div slot="main">导入体测成绩</div>
        <div slot="remark"></div>
      </item>
    </div>
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
        count: 0
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        physicalTest: 'getPhysicalTest'
      })
    },
    methods: {
      ...mapActions(['setPhysicalTest']),
      fetchData() {
        const that = this
        Api.getProjects(that.currentGroup.groupId).then(res => {
          that.list = res.items
          that.count = res.totalCount
        })
      },
      projectSetting() {
        this.setPhysicalTest({ items: this.list })
        this.routePush({ name: 'projectSetting1153' })
      },
      exportGrades() {
        this.routePush({ name: 'exportGrades1153' })
      },
      importGrades() {
        this.routePush({ name: 'importGrades1153' })
      }
    }
  }
</script>
