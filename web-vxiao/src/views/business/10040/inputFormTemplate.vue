<template>
  <Page title="输入表模">
    <item v-for="(item,index) in Templates"
          :key="index"
          @click="TemplateClick(item,index)">
      <div>{{item.name}}</div>
      <div slot="remark"
           class="dateTime">{{item.date}}</div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        Templates: []
      }
    },
    created() {
      this.getTemplate()
    },
    methods: {
      TemplateClick(item, index) {
        this.routePush({
          name: 'setTime10040',
          query: { title: item.name, templateId: item.id }
        })
      },
      getTemplate() {
        Api.getTemplate().then(res => {
          if (res.code === '1') {
            this.Templates = res.templates
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dateTimet input {
    text-align: center !important;
  }
</style>
