<template>
  <page title="学校分组">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleGrouping(item)">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="remarkTxt(item)"></div>
    </item>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main">添加分组</div>
    </item>
    <div class="category-title text">待分组学校</div>
    <item v-for="(item,i) in schools"
          :key="i"
          :hasClick="false">
      <div slot="main"
           v-html="item.schoolName"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        schools: []
      }
    },
    components: {},
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getSuperviseAppraisal'
      })
    },
    methods: {
      ...mapActions(['setSuperviseAppraisal']),
      remarkTxt(item) {
        return item.schools ? `${item.schools.length}所` : ''
      },
      fetchData() {
        const that = this
        Api.loadSchoolGroupingList(that.currentGroup.parentId).then(res => {
          that.list = res.sgroups || []
          that.schools = res.schools || []
        })
      },
      handleAdd() {
        this.setSuperviseAppraisal({ grouping: null, schools: this.schools })
        this.routePush({ name: 'groupingEdit1170' })
      },
      handleGrouping(item) {
        this.setSuperviseAppraisal({ grouping: item, schools: this.schools })
        this.routePush({ name: 'groupingEdit1170' })
      }
    }
  }
</script>
