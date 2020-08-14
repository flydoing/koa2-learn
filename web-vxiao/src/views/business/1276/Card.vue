<template>
  <CardSimple :message="message"
              @detail="handleDetail"
              v-if="isOrg">
    <div v-if="jsonTxt.date"
         v-html="jsonTxt.date"></div>
    <div v-if="jsonTxt.range"
         v-html="jsonTxt.range"></div>
  </CardSimple>
  <Card v-else
        :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <div v-if="jsonTxt.date"
           v-html="jsonTxt.date"></div>
    </CardContent>
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
    computed: {
      jsonTxt() {
        let mJson = this.message.msgJson ? JSON.parse(this.message.msgJson) : null
        if (mJson) {
          return {
            date: mJson.name || '',
            range: mJson.extension || ''
          }
        }
        return {}
      }
    },
    methods: {
      handleDetail() {
        this.routePushModel({
          name: 'cardDetail',
          params: { msgId: this.message.id },
          query: { type: this.message.type }
        })
      }
    }
  }
</script>
