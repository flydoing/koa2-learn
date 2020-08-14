<template>
  <page title="选择班级"
        closePrompt>

    <item @click="classChoose(item,index)"
          v-for="(item,index) in classArr"
          :key="index">
      <div slot="main">{{item.name}}</div>
      <div slot="remark"></div>
    </item>
  </page>
</template>
<script>
  import groupApi from '@/api/group.js'
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  // import { mapGetters, mapActions } from 'vuex'
  // import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        classArr: [],
        gradeArr: []
      }
    },
    created() {
      this.getClasses()
    },
    computed: {},
    methods: {
      getClasses() {
        const schoolId = this.schoolId
        groupApi.getSchoolGroupList(schoolId).then(res => {
          if (res.code === '1' && res.groups) {
            this.classArr = res.groups.filter(item => item.type === '2')
            this.gradeArr = res.groups.filter(item => item.type === '3')
            this.classArr.map(item1 => {
              this.gradeArr.map(item2 => {
                if (item1.gId === item2.id) item1.name = item2.name + item1.name
              })
            })
          }
        })
      },
      classChoose(item, index) {
        let groupId = item.groupId
        const title = item.name
        this.routePush({ name: 'selectMember1162', query: { groupId: groupId, title: title } })
      }
    }
  }
</script>
<style lang="scss">
</style>
