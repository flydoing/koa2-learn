<template>
  <Setup appType="'1123'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1123'))"
              slot="others">
      <template v-for="(item, i) in settings">
        <item v-if="settings.length>0"
              :key="i"
              @click="handleItem(item)">
          <div>{{item.gradeName}}</div>
          <div slot="remark">{{item.extension}}</div>
        </item>
      </template>
    </template>
  </Setup>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        settings: []
      }
    },
    created() {
      Api.loadGrades(this.groupId).then(res => {
        this.settings = res.settings
      })
    },
    methods: {
      handleItem(item) {
        this.routePush({
          name: 'settingDetail1123',
          query: {
            grade: item.grade,
            gradeName: item.gradeName
          }
        })
      }
    }
  }
</script>
