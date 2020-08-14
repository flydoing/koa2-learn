<template>
  <page :title="title"
        :showTips="list.length === 0">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item, i)"
          :label="item.content">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        let field = this.obj.field || {}
        this.list = field.options || []
      },
      handleItem(item, index) {
        this.setCreateObject({ field: { ...this.obj.field, content: item.content, optionId: item.id } })
        this.routeBack()
      }
    }
  }
</script>
