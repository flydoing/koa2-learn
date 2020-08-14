<template>
  <page :title="title">
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item, i)">
      <div slot="main"
           v-html="item.content"></div>
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
        getSchool: 'getSchoolBySchoolId',
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        this.list = this.obj.options || []
      },
      handleItem(item, index) {
        this.setCreateObject({ formItem: { ...this.obj.formItem, content: item.content, optionId: item.id } })
        this.routeBack()
      }
    }
  }
</script>
