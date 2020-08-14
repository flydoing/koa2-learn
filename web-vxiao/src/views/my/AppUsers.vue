<template>
  <Page :title="app.name"
        :loading="loading">
    <div class="pd">
      <ItemList @click="handle(user)"
                v-for="user in users"
                :key="user.id">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(user.avatar,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO'>
        <span slot="title">{{user.name}}</span>
        <span slot="main">{{user.schools | arrayNameToString}}</span>
      </ItemList>
    </div>
  </Page>
</template>
<script>
import Api from './api'
export default {
  data() {
    return {
      app: {},
      users: [],
      loading: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.app = this.$route.query
      Api.loadAppUsers(this.app.type)
        .then(res => {
          this.users = res.users
          this.loading = false
        })
        .catch(res => {
          this.loading = false
        })
    },
    handle(user) {
      let type = this.app.type === '1213' ? 'motion' : this.app.type === '1240' ? 'consume' : 'books'
      this.routePush({
        path: `/vx/user/app/${type}/${user.id}`,
        query: {
          type: this.app.type,
          name: user.name
        }
      })
    }
  },
  watch: {
    '$route.params'() {
      this.init()
    }
  }
}
</script>
