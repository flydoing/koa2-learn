<template>
  <Card :message="message">
    <div slot="titles" v-if="link">
      <span>{{link.label}}</span>
      <span class="text-color" @click="agentHandle">{{link.name}}</span>
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
              label: '客户',
              name: _m.title,
              id: _m.clientId
            }
          }
        } catch (e) {}
        return false
      }
    },
    methods: {
      agentHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
