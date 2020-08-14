<template>
  <page title="评价模板" @scrollEnd="scrollEnd">
    <div class="template-list">
      <item v-if="lists.length>0" v-for="(template, t) in lists" :key="t" @click="templateDetail(template)">
        <div>{{template.title}}</div>
        <div slot="remark">{{template.content}}</div>
      </item>
    </div>
    <item @click="addTemplate">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div>新模板</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        lists: [],
        currentPage: 1,
        hasNextPage: 0
      }
    },
    created() {
      this.loadTemplateList()
    },
    methods: {
      ...mapActions(['clearTemplate', 'saveTemplate']),
      scrollEnd() {
        this.hasNextPage > 0 && this.loadTemplateList()
      },
      loadTemplateList() {
        Api.getTemplateList(this.currentGroup.groupId, this.routeQuery('appType'), this.userId, this.currentPage).then(
          res => {
            res.templates ? this.lists = [...this.lists, ...res.templates] : this.lists = []
          }).catch(res => {})
      },
      addTemplate() {
        this.clearTemplate()
        this.saveTemplate({
          ...this.template,
          metaDatas: [{
            obj: '优秀',
            key: 90,
            extension: 1
          }, {
            obj: '中等',
            key: 80,
            extension: 1
          }, {
            obj: '良好',
            key: 70,
            extension: 1
          }, {
            obj: '加油',
            key: 69,
            extension: 0
          }],
          categories: []
        })
        this.routePush({
          name: 'templateAdd1192',
          query: {
            appType: this.routeQuery('appType')
          }
        })
      },
      templateDetail(t) {
        this.routePush({
          name: 'templateAdd1192',
          query: {
            templateId: t.id,
            appType: this.routeQuery('appType')
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      })
    }
  }

</script>
