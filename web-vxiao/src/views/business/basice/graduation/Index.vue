<template>
  <Page title="毕业班级"
        :showTips="years.length === 0">
    <Item v-for="(v,i) in years"
          :key="i"
          @click="onClick(v)">
      <div>{{v.name}}</div>
      <div slot="remark">{{v.extension}}</div>
    </Item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return { years: [] }
    },
    methods: {
      init() {
        this.$http.get(`/base/group/graduated/${this.currentGroup.parentId}`).then(res => {
          this.years = res.groups || []
        })
      },
      onClick(y) {
        this.routePush({
          name: 'basiceGraduationYear',
          query: {
            year: y.year,
            title: y.name
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
