<template>
  <page title="宿舍楼"
        hasAdd
        @add="handleAdd">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleItem(item)">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           @click.stop="handleEdit(item)">编辑</div>
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {},
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        CategoryApi.getCategorys({
          type: '205',
          groupId: this.groupId
        }).then((res) => {
          this.list = res.categorys || []
        })
      },
      handleItem(item) {
        this.setStorage('_dormitory_category_cache', item)
        this.routeBack()
      },
      commitData(data, callback) {
        CategoryApi.addCategory([data]).then((res) => {
          callback && callback(res)
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleRemove(item, i) {
        this.$confirm('确认删除该宿舍楼？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commitData({ id: item.id, status: 'd' }, () => {
            this.list.splice(i, 1)
          })
        })
      },
      handleAdd() {
        this.$prompt(' ', '新增', {
          inputPlaceholder: '输入名称',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '名称不能为空', type: 'warning' })
            return false
          }
          this.commitData(
            {
              name: value,
              status: '1',
              type: '205',
              groupId: this.groupId
            },
            (res) => {
              this.list.push(res.categorys[0])
            }
          )
        })
      },
      handleEdit(item) {
        this.$prompt(' ', '编辑', {
          inputPlaceholder: '输入名称',
          inputValue: item.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '名称不能为空', type: 'warning' })
            return false
          }
          this.commitData(
            {
              ...item,
              name: value
            },
            (res) => {
              item.name = value
            }
          )
        })
      }
    }
  }
</script>
