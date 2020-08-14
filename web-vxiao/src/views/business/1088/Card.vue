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
  import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      link() {
        let _m = this.message
        try {
          var json = _m.msgJson ? JSON.parse(_m.msgJson) : null
          if (_m.title && !Check.isNullObject(json)) {
            return {
              label: '代理商：',
              name: _m.title,
              id: json.agentId
            }
          }
        } catch (e) {}
        return false
      }
    },
    methods: {
      handleLink(data) {
        this.routePush({
          path: '/vx/group/business/1079/detail',
          query: {
            aid: data.id
          }
        })
      }
    }
  }
</script>
