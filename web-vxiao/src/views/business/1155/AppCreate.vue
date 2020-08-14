<template>
  <page title="新建体检">
    <div class="physical-exam-create">
      <item @click="projectSetting">
        <div slot="main">体检项目设置</div>
        <div slot="remark">{{count}}项</div>
      </item>
      <item @click="importReport">
        <div slot="main">导入体检报告</div>
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
        physicalExam: 'getPhysicalExam'
      })
    },
    methods: {
      ...mapActions(['setPhysicalExam']),
      fetchData() {
        const that = this
        Api.getProjects(that.currentGroup.groupId).then(res => {
          that.list = res.projects
          that.count = res.validSum
        })
      },
      projectSetting() {
        this.setPhysicalExam({ items: this.list })
        this.routePush({ name: 'projectSetting1155' })
      },
      importReport() {
        this.routePush({ name: 'importReport1155' })
      }
    }
  }
</script>
