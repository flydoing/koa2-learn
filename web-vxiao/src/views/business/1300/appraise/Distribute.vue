<template>
  <page :title="title"
        closePrompt>
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.title"
          :remark="item.score"
          @click="handleAspiration(item)"
          :hasArrow="false">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      },
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      msgId() {
        return this.routeQuery('msgId')
      }
    },
    created() {
      let personNo = this.routeQuery('personNo')
      Api.getAspirations(this.msgId, personNo).then(res => {
        this.list = res.aspirations || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleAspiration(item) {
        let params = this.obj.params || {}
        if (params.cback) {
          params.cback(item, () => {
            this.routeBack()
          })
        } else {
          this.setCreateObject({ aspiration: item })
          this.routeBack()
        }
      }
    }
  }
</script>
