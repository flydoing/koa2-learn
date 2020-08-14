<template>
  <Page title="选择项目"
        closePrompt
        hasSubmit
        @submit="handleSubmit"
        :showTips="list.length === 0">
    <div class="category-title"
         v-if="list.length > 0">共{{list.length}}个项目</div>
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.name"
          :hasArrow="false"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api1085 from '@/views/business/1085/api'
  export default {
    mixins: [R],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    created() {
      let pMap = new Map()
      if (Check.isRealArray(this.crm.projects)) {
        this.crm.projects.forEach(v => {
          pMap.set(v.id, v)
        })
      }
      Api1085.getProjects({ groupId: this.groupId }).then(res => {
        if (res.projects) {
          this.list = res.projects.map(v => {
            return { ...v, selected: Check.isObject(pMap.get(v.id)) }
          })
        }
      })
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        let projects = this.list.filter(v => {
          return v.selected
        })
        this.setCrm({ projects: projects })
        this.routeBack()
      }
    }
  }
</script>
