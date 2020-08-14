<template>
  <page title="选择科目">
    <item v-if="subjects.length>0"
          v-for="(subject, i) in subjects"
          :key="i"
          @click="itemClick(subject)">
      <div>{{subject.name}}</div>
    </item>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        subjects: []
      }
    },
    computed: {
      ...mapGetters({
        cacheHomework: 'getHomework'
      })
    },
    created() {
      CategoryApi.getCategorys({
        type: '1',
        groupId: this.currentGroup.groupId
      }).then(res => {
        this.subjects = res.categorys
        // this.subjects.push({
        //   name: '不区分科目',
        //   id: 0
        // })
      })
    },
    methods: {
      ...mapActions(['saveHomework']),
      itemClick(subject) {
        this.saveHomework({
          ...this.cacheHomework,
          subject: { ...subject }
        })
        this.routeBack()
      }
    }
  }
</script>
