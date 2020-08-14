<template>
  <Setup appType="'1170'">
    <template v-if="isEducation && (isSuperAdmin || isAdmin || isAppAdmin('1170'))" slot="others">
      <item @click="schoolGrouping">
        <div slot="main">学校分组</div>
      </item>
      <item @click="groupingAssessor">
        <div slot="main">分组评估人</div>
      </item>
      <item @click="appraisalProject">
        <div slot="main">评估项目</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  created() {},
  computed: {},
  methods: {
    schoolGrouping() {
      this.routePush({ name: 'schoolGrouping1170' })
    },
    groupingAssessor() {
      this.routePush({ name: 'groupingAssessor1170' })
    },
    appraisalProject() {
      this.routePush({ name: 'appraisalProject1170' })
    }
  }
}

</script>
