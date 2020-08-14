<template>
  <page title="科目类别">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active': item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           @click.stop="handleEdit(item)">编辑</div>
    </item>
    <item @click="handleAdd">
      <div slot="main">新增</div>
    </item>
  </page>
</template>
<script>
  import Api from '@/views/business/1123/api'
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    computed: {},
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
        let category = this.getStorage('_subject_category_cache') || {}
        CategoryApi.getCategorys({
          type: '202',
          groupId: this.groupId,
          isDefault: '0'
        }).then((res) => {
          if (res.categorys) {
            this.list = res.categorys.map((v) => {
              v.selected = v.id === category.id
              return v
            })
          }
        })
      },
      handleSelect(item) {
        let postData = {
          groupId: this.groupId,
          parentId: this.routeQuery('sId'),
          value: item.id,
          status: '1'
        }
        Api.saveSubjectRelation({ categorys: [postData] }).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      handleEdit(item) {
        this.setStorage('_subject_category_cache', item)
        this.routePush({ name: 'basiceSubjectCategoryEdit' })
      },
      handleAdd() {
        this.routePush({ name: 'basiceSubjectCategoryEdit' })
      }
    }
  }
</script>
