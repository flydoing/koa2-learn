<template>
  <page title="科目类别"
        hasSubmit
        @submit="handleSubmit">
    <item class="full-input"
          :hasClick="false">
      <input type="text"
             placeholder="输入内容"
             v-model="category.name">
    </item>
    <div v-if="category.id"
         class="button-common button"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    computed: {},
    data() {
      return {
        category: {
          name: '',
          type: '202'
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let category = this.getStorage('_subject_category_cache')
        if (category) {
          this.category = { ...category }
        }
      },
      handleRemove() {
        this.$confirm('确认删除该分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CategoryApi.addCategory([
            {
              ...this.category,
              status: 'd'
            }
          ]).then((res) => {
            this.$message({ type: 'success', message: '操作成功' })
            this.routeBack()
          })
        })
      },
      handleSubmit() {
        CategoryApi.addCategory([
          {
            ...this.category,
            groupId: this.groupId
          }
        ]).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
