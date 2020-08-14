<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          class="full-input">
      <input placeholder="分类名称"
             v-model="category.name" />
    </item>
    <div class="category-title"></div>
    <template v-if="category.childs">
      <item v-for="(child,i) in category.childs"
            :key="i"
            :hasClick="false">
        <input placeholder="评价项目"
               v-model="child.name" />
        <i slot="after"
           class='ico ico-delete'
           @click="handleRemoveItem(child,i)"></i>
      </item>
    </template>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main">新项目</div>
    </item>
    <div v-if="category.id"
         class="button button-common"
         @click="handleRemove">删除分类</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        category: {
          name: '',
          childs: []
        },
        removeList: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCourseEvaluate'
      }),
      title() {
        return this.category.id ? `编辑分类 ` : '新建分类'
      }
    },
    methods: {
      ...mapActions(['setCourseEvaluate']),
      fetchData() {
        const that = this
        if (that.evaluate.category) {
          let cate = that.evaluate.category
          that.category = JSON.parse(JSON.stringify({ ...cate, childs: cate.childs || [] }))
        }
      },
      handleAdd() {
        this.category.childs.push({ name: '' })
      },
      handleRemoveItem(item, index) {
        this.removeList.push(item)
        this.category.childs.splice(index, 1)
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该分类？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitCategory({ id: that.category.id, status: 'd' }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this
        let category = that.category

        if (Check.isNullString(category.name)) {
          that.$message({ message: '分类名称不能为空', type: 'warning' })
          return false
        }

        let flag = true
        let childs = category.childs.map(v => {
          if (Check.isNullString(v.name)) {
            flag = false
          }
          v = {
            ...v,
            groupId: that.currentGroup.groupId,
            status: '1',
            type: '101'
          }
          category.id && (v.parentId = category.id)
          return v
        })

        if (Check.isRealArray(that.removeList)) {
          that.removeList.map(v => {
            if (v.id) {
              v.status = 'd'
              childs.push(v)
            }
          })
        }

        if (!flag) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }

        let postData = {
          name: category.name,
          childs: childs,
          groupId: that.currentGroup.groupId,
          status: '1',
          type: '100'
        }
        category.id && (postData.id = category.id)
        Api.commitCategory(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
