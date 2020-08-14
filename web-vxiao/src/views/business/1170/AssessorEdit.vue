<template>
  <page :title="title">
    <div class="category-title text">主评估人</div>
    <Relate :items="users" :plus="true" :reduce="true" @plus="userAdd" @delete="userRemove" />
    <div class="category-title text">副评估人</div>
    <Relate :items="deputyUsers" :plus="true" :reduce="true" @plus="deputyAdd" @delete="deputyRemove" />
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  props: {},
  data() {
    return {
      users: [],
      deputyUsers: []
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getSuperviseAppraisal'
    }),
    title() {
      let grouping = this.appraisal.grouping
      return grouping ? `${grouping.name}评估人` : ''
    }
  },
  components: {
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  methods: {
    ...mapActions(['setSuperviseAppraisal']),
    fetchData() {
      const that = this
      let grouping = that.appraisal.grouping
      if (Check.isRealArray(grouping.persons)) {
        this.users = grouping.persons.map(v => {
          return { ...v, avatar: that.url(v.avatar), logo: v.avatar }
        })
      }
      if (Check.isRealArray(grouping.deputyPersons)) {
        this.deputyUsers = grouping.deputyPersons.map(v => {
          return { ...v, avatar: that.url(v.avatar), logo: v.avatar }
        })
      }
    },
    userAdd() {
      this.setSuperviseAppraisal({ users: this.users, deputyUsers: this.deputyUsers, isDeputy: false })
      this.routePush({ name: 'selectMember1170' })
    },
    deputyAdd() {
      this.setSuperviseAppraisal({ users: this.users, deputyUsers: this.deputyUsers, isDeputy: true })
      this.routePush({ name: 'selectMember1170' })
    },
    removeData(users, type, user, index) {
      const that = this
      let us = []
      users.map(v => {
        if (v.userId !== user.userId) {
          us.push({ userId: v.userId, type: type })
        }
      })
      Api.commitGroupingAssessor({ sgroupId: that.appraisal.grouping.id, spersons: us, type: type }).then(res => {
        users.splice(index, 1)
        that.$message({ message: '操作成功', type: 'success' })
      })
    },
    userRemove(u, i) {
      this.removeData(this.users, '1', u, i)
    },
    deputyRemove(u, i) {
      this.removeData(this.deputyUsers, '2', u, i)
    }
  }
}

</script>
