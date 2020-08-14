<template>
  <page title="选择评价模板"
        @scrollEnd="scrollEnd">
    <item v-if="lists.length>0"
          v-for="(template, t) in lists"
          :key="t"
          @click="templateDetail(template)">
      <div>
        {{template.title}}
        <P>{{template.content}}</P>
      </div>
      <div slot="remark"
           @click.stop="templatePreview(template)">预览</div>
    </item>
  </page>
</template>
<script>
import Api from './api'
import G from '@/views/group/mixin'
import { mapActions } from 'vuex'
import * as Storage from '@/utils/storage'
export default {
  mixins: [G],
  data() {
    return {
      lists: [],
      hasNextPage: 0,
      currentPage: 1
    }
  },
  created() {
    this.loadTemplateList()
  },
  methods: {
    ...mapActions(['savePublicCourseCreateMain']),
    templateDetail(template) {
      this.savePublicCourseCreateMain({
        template: template
      })
      this.routeBack()
    },
    scrollEnd() {
      this.hasNextPage > 0 && this.loadTemplateList()
    },
    loadTemplateList() {
      // views/group/List.vue: Storage.local.set(`VX_schoolId`, this.parentId)
      let schoolId = Storage.local.getString(`VX_schoolId`)
      Api.getTemplateList(schoolId, '1192', this.userId, this.currentPage)
        .then(res => {
          res.templates ? (this.lists = [...this.lists, ...res.templates]) : (this.lists = [])
        })
        .catch(res => {})
    },
    templatePreview(t) {
      this.routePush({
        name: 'templateAdd1192',
        query: {
          templateId: t.id,
          appType: '1192'
        }
      })
    }
  }
}
</script>
