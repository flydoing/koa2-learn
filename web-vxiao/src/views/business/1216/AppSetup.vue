<template>
  <Setup appType="'1216'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1216'))" slot="others">
      <item @click="inspectionPlace">
        <div slot="main">巡检地点</div>
      </item>
      <item @click="inspectionProject">
        <div slot="main">巡检项目</div>
      </item>
      <item @click="inspectionSchedule">
        <div slot="main">巡检排班</div>
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
    inspectionPlace() {
      this.routePush({ name: 'inspectionPlace1216' })
    },
    inspectionProject() {
      this.routePush({ name: 'inspectionProject1216' })
    },
    inspectionSchedule() {
      this.routePush({ name: 'inspectionSchedule1216' })
    }
  }
}

</script>
