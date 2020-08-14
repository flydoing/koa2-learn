<template>
  <Page :title="title"
        :loading="loading">
    <Item v-for="(p,i) in categorys"
          :key="i"
          :label="p.name"
          @click="onCategory(p)">
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/category'
  export default {
    created() {},
    data() {
      return {
        categorys: [],
        loading: true
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '绑定场所'
      }
    },
    activated() {
      Api.getCategorys({
        groupId: this.routeQuery('groupId'),
        type: this.routeQuery('type')
      })
        .then(res => {
          this.categorys = res.categorys
          this.loading = false
        })
        .catch(res => (this.loading = false))
    },
    methods: {
      onCategory(c) {
        this.setStorage('_cache_place_category', c)
        this.routePush({
          path: '/vx/group/place/select',
          query: {
            title: c.name,
            depth: this.routeQuery('depth'),
            schoolId: this.routeQuery('groupId'),
            type: c.value
          }
        })
      }
    }
  }
</script>
