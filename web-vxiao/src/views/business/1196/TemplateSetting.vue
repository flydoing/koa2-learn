<template>
  <page title="评估模板设置" @add="handleAdd" :hasAdd="true">
    <div class="template-setting">
      <item v-for="(item, i) in list" :key="i" @click="handleItem(item)" v-if="item.name">
        <div slot="main">
          <div v-html="item.name"></div>
          <div class="remark-txt" v-html="item.description"></div>
        </div>
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
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getStudentAppraisal'
    })
  },
  methods: {
    ...mapActions(['setStudentAppraisal']),
    fetchData() {
      const that = this
      Api.loadTemplateList(that.currentGroup.groupId).then(res => {
        that.list = res.models || []
      })
    },
    handleAdd() {
      this.setStudentAppraisal({ tmpCache: null, template: null })
      this.routePush({ name: 'templateDetail1196' })
    },
    handleItem(item) {
      this.setStudentAppraisal({ tmpCache: item, template: null })
      this.routePush({ name: 'templateDetail1196' })
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.template-setting {
  .remark-txt {
    color: #999;
    font-size: rem(13);
  }
}

</style>
