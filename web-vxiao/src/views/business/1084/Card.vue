<template>
  <Card :message="message">
    <div slot="titles"
         v-if="link">
      <span>{{link.label}}</span>
      <span class="text-color"
            @click="handleLink(link)">{{link.name}}</span>
    </div>
  </Card>
</template>
<script>
  export default {
    props: {
      message: { type: [Object] }
    },
    computed: {
      link() {
        let _m = this.message
        try {
          if (_m.title) {
            return {
              label: '客户：',
              name: _m.title,
              id: _m.clientId
            }
          }
        } catch (e) {}
        return false
      }
    },
    methods: {
      handleLink(data) {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1062',
            groupId: this.groupId,
            cid: data.id
          }
        })
      }
    }
  }
</script>
