<template>
  <page title="规则预设">
    <item label="固定不排课程"
          @click="handleSubject"></item>
    <div class="category-title"></div>
    <item label="固定安排选修科目"
          @click="handleGrade"></item>
    <item label="固定安排选修活动"
          @click="handleActivity"></item>
  </page>
</template>
<script>
  export default {
    methods: {
      handleSubject() {
        this.routePush({ path: '/vx/group/business/1147/ruleStep/selectSubject' })
      },
      handleGrade() {
        this.routePush({ path: '/vx/group/business/1147/ruleStep/selectGrade' })
      },
      handleActivity() {
        this.routePush({ path: '/vx/group/business/1147/ruleStep/selectActivity' })
      }
    }
  }
</script>
