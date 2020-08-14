<template>
  <Page title="模式管理"
        :loading="loading">
    <ItemList v-for="(pattern,i) in patterns"
              :key="i"
              @click="handle(pattern)">
      <span slot="title">{{pattern.name}}</span>
      <span slot="main">{{pattern.description}}</span>
      <div slot="after">
        <i-switch :value="pattern.status"
                  trueValue='1'
                  falseValue="0"
                  @click="handle(pattern)"></i-switch>
      </div>
    </ItemList>
  </Page>
</template>

<script>
  import Api from '../api'
  export default {
    data() {
      return { patterns: [], loading: true }
    },
    created() {
      Api.getVscreenPattern(this.routeQuery('schoolId'), this.routeQuery('categoryId')).then(res => {
        this.patterns = res.modes
        this.loading = false
      })
    },
    methods: {
      handle(pattern) {
        Api.modifyVscreenPattern({
          modes: [
            {
              ...pattern,
              status: pattern.status === '1' ? '0' : '1'
            }
          ],
          ...this.$route.query
        }).then(res => {
          this.$set(pattern, 'status', pattern.status === '1' ? '0' : '1')
          this.$message({ type: 'success', message: '修改成功' })
        })
      }
    }
  }
</script>
