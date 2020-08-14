<template>
  <Setup>
    <div slot="split"
         class="category-title text">招生方案</div>
    <template slot="others"
              v-if="(isSuperAdmin || isAdmin || isAppAdmin('1300')) && isOrg">
      <item v-for="(item, i) in list"
            :key="i"
            :label="item.title"
            @click="handleCase(item)">
      </item>
      <item label="新增"
            :hasArrow="false"
            @click="handleAdd">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    computed: {},
    created() {
      Api.getCases(this.schoolId).then(res => {
        this.list = res.forms || []
      })
    },
    methods: {
      ...mapActions(['modifyCreateObjectField']),
      handleAdd() {
        this.modifyCreateObjectField('form')
        this.routePush({
          path: '/vx/group/business/1300/caseEdit'
        })
      },
      handleCase(item) {
        this.modifyCreateObjectField('form')
        this.routePush({
          path: '/vx/group/business/1300/caseEdit',
          query: { formId: item.id }
        })
      }
    }
  }
</script>
