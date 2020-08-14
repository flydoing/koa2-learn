<template>
  <page :title="title">
    <item v-for="(item,i) in users" :key="i" @click="handleItem(item)">
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="remarkTxt(item)"></div>
    </item>
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
      users: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      visitor: 'getVisitor'
    }),
    title() {
      return this.visitor.group ? this.visitor.group.name : ''
    }
  },
  methods: {
    ...mapActions(['setVisitor']),
    fetchData() {
      const that = this
      let group = that.visitor.group
      GroupApi.getGroupUsers(group.groupId, { userType: '3' }).then(res => {
        that.users = res.relations || []
      })
    },
    remarkTxt(item) {
      return item.simpleIdcard || '身份证后六位'
    },
    handleItem(item) {
      this.setVisitor({ parent: item })
      this.routePush({ name: 'idcardEdit1142' })
    }
  }
}

</script>
