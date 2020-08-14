<template>
  <Card :message="message">
    <div slot="titles"
         v-html="m.title"></div>
    <CardHref content="查看详情"
              @click="handleDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    methods: {
      handleDetail() {
        let url = this.message.extensionType
        let mJson = JSON.parse(this.message.msgJson || '{}')
        let pid = 0
        if (url.indexOf('projectId=') !== -1) {
          pid = url.substring(url.indexOf('projectId=')).replace('projectId=', '')
        } else {
          pid = url.substring(url.indexOf('pid=')).replace('pid=', '')
        }
        this.routePushModel({
          name: 'detail1138',
          query: {
            pid: pid,
            title: mJson.name || ''
          }
        })
      }
    }
  }
</script>
