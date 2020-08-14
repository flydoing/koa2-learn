<template>
  <page title="选择评课模板" @scrollEnd="scrollEnd">
    <item v-if="templatelist.length>0" v-for="(template, t) in templatelist" :key="t" @click="itemClick(template)">
      <div>{{template.title}}</div>
      <div slot="remark">{{template.content}}</div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  import {mapActions} from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        templatelist: [{
          id: '',
          title: '不评'
        }],
        currentPage: 1,
        hasNextPage: 0
      }
    },
    created() {
      this.loadTemplates()
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      scrollEnd() {
        this.hasNextPage > 0 && this.loadTemplates()
      },
      loadTemplates() {
        Api.getClassRoomTemplates(this.currentGroup.groupId, '1073', this.userId, this.currentPage).then(res => {
          if (res.hasNextPage > 0) {
            this.currentPage = res.currentPage
            this.hasNextPage = res.hasNextPage
          } else {
            this.hasNextPage = 0
          }
          res.templates ? this.templatelist = [...this.templatelist, ...res.templates] : this.templatelist = [{id: '', title: '不评'}]
        })
      },
      itemClick(t) {
        this.saveClassRoomCreate({
          template: t
        })
        this.routeBack()
      }
    }
  }

</script>
