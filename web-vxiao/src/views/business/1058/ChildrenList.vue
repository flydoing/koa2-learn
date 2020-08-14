<template>
  <page title="点餐">
    <item v-if="users.length>0" v-for="(user, u) in users" :key="u" @click="itemClick(user)">
      <div>{{user.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '@/api/message'
  export default {
    data() {
      return {
        users: []
      }
    },
    created() {
      Api.getMessageById(this.routeQuery('msgId')).then(res => {
        this.users = JSON.parse(res.message.remark).users
      })
    },
    methods: {
      itemClick(user) {
        this.routePushModel({
          // path: `/vx/group/business/1058/Detail/${this.routeQuery('msgId')}`,
          name: 'detailMenuList1058',
          query: {
            userId: user.id,
            msgId: this.routeQuery('msgId')
          }
        })
      }
    }
  }

</script>
