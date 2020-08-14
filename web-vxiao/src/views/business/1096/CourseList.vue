<template>
  <page title="必选">
    <div class="course-list">
      <item v-for="(item, i) in list" :key="i" @click="handleCourse(item)">
        <div slot="main" v-html="item.name"></div>
        <div slot="remark">{{item.joined}}/{{item.upperLimit}}已选</div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      })
    },
    created() {
      let item = this.selection.item
      let publish = this.selection.publish
      Api.getCourseList({
        id: publish.id,
        userId: item.userId,
        groupId: item.groupId,
        required: item.required,
        role: publish.role
      }).then(res => {
        if (res.courses) {
          this.list = res.courses
        }
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      handleCourse(item) {
        this.setSelection({ course: item })
        this.routePush({ name: 'courseInfo1096' })
      }
    }
  }

</script>
