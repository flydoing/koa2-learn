<template>
  <page title="备注"
        @submit="handleSubmit"
        :hasSubmit="!appraisal.isDetail">
    <div class="add-remark">
      <template v-if="!appraisal.isDetail">
        <TextInput placeholder="输入内容"
                   v-model="content"></TextInput>
      </template>
      <template v-else>
        <div class='remark-txt'
             v-html="content"></div>
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        content: ''
      }
    },
    created() {
      this.content = this.appraisal.remark
    },
    computed: {
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      })
    },
    methods: {
      ...mapActions(['setTeacherAppraisal']),
      handleSubmit() {
        this.setTeacherAppraisal({ remark: this.content })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .add-remark {
    & > textarea {
      height: rem(150);
    }
  }

  .remark-txt {
    padding: rem(10);
    text-align: justify;
  }
</style>
