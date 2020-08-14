<template>
  <page title="选择科目" hasSubmit @submit="handleSelect">
    <item v-if="subjects.length>0" v-for="(subject, i) in subjects" :key="i" @click="itemClick(subject)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active': subject.isSelect}"></i>
      </div>
      <div>{{subject.name}}</div>
    </item>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  import G from '@/views/group/mixin'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        subjects: []
      }
    },
    computed: {
      ...mapGetters({
        cacheMain: 'getPublicCourseCreateMain'
      })
    },
    created() {
      const that = this
      CategoryApi.getCategorys({
        type: 1,
        groupId: this.currentGroup.groupId
      }).then(res => {
        this.subjects = [...this.subjects, ...res.categorys]
        if (this.cacheMain.subject.name !== '') {
          this.subjects.forEach(s => {
            if (s.name === this.cacheMain.subject.name) {
              that.$set(s, 'isSelect', true)
            }
          })
        }
      })
    },
    methods: {
      ...mapActions(['savePublicCourseCreateMain']),
      itemClick(subject) {
        this.subjects.forEach(s => {
          this.$set(s, 'isSelect', false)
        })
        this.$set(subject, 'isSelect', true)
      },
      handleSelect() {
        let subject = this.subjects.filter(s => {
          return s.isSelect
        })
        this.savePublicCourseCreateMain({
          subject: subject[0]
        })
        this.routeBack()
      }
    }
  }

</script>
