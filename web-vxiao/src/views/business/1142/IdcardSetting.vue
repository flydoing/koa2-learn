<template>
  <page title="家长身份证设置">
    <div v-for="(item,i) in list" :key="i">
      <div class="category-title text" v-html="item.name"></div>
      <item v-for="(cls,j) in item.groups" :key="j" @click="handleClass(cls)">
        <div slot="main" v-html="cls.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import GroupApi from '@/api/group'
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
      visitor: 'getVisitor'
    })
  },
  methods: {
    ...mapActions(['setVisitor']),
    fetchData() {
      const that = this
      GroupApi.getSchoolClasses(that.currentGroup.parentId).then(res => {
        that.list = res.groups || []
      })
    },
    handleClass(cls) {
      this.setVisitor({ group: cls })
      this.routePush({ name: 'parentList1142' })
    }
  }
}

</script>
