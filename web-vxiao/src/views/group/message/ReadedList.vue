<template>
  <page :title="title"
        :loading="loading">
    <Relate :items="us"
            :plus="false"
            :reduce="false" />
  </page>
</template>
<script>
  import Api from '@/api/message'
  import Check from '@/utils/check'
  export default {
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        title: '已阅人数',
        users: [],
        loading: true
      }
    },
    computed: {
      us() {
        const that = this
        let _users = []
        if (Check.isRealArray(that.users)) {
          that.users.some(u => {
            _users.push(
              Object.assign({}, u, {
                avatar: that.url(u.avatar, 'thumb'),
                icon: u.readed === '1' ? 'ico-readed-press' : ''
              })
            )
          })
        }
        return _users
      }
    },
    created() {
      const that = this
      const msgId = this.routeParam('msgId')
      this.title = this.routeQuery('title') || '已阅人数'
      Api.getReadedList(msgId).then(res => {
        if (Check.isRealArray(res.readed)) {
          that.users = res.readed
        }
        if (res.readed && res.message && res.message.readCount > 0) {
          that.title = `${that.title}（${res.message.readCount}/${res.readed.length}）`
        }
        this.loading = false
      })
    },
    methods: {}
  }
</script>
