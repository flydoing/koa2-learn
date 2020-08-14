<template>
  <page title="科目类别">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleSelect(item)">
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Api from '../api'
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    computed: {
      ...mapGetters({
        exam: 'getExam'
      })
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        CategoryApi.getCategorys({
          type: '202',
          groupId: this.groupId,
          isDefault: '0'
        }).then((res) => {
          this.list = res.categorys || []
        })
      },
      handleSelect(item) {
        let postData = {
          groupId: this.groupId,
          parentId: this.exam.subject.id,
          value: item.id,
          status: '1'
        }
        Api.saveSubjectRelation({ categorys: [postData] }).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
