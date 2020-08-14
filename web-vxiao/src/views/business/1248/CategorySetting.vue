<template>
  <page title="分类设置">
    <div v-for="(item,i) in list"
         :key="i">
      <item @click="handleItem(item)">
        <div slot="main"
             v-html="item.name"></div>
        <i slot="after"
           class='ico ico-delete'
           @click.stop="handleRemove(item,i)"></i>
      </item>
    </div>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {},
    methods: {
      fectchData() {
        Api.getItems(this.currentGroup.parentId).then(res => {
          this.list = res.items
        })
      },
      editItem(data, title, callback) {
        const that = this
        if (!Check.isObject(data)) {
          data = {
            name: '',
            type: '194',
            groupId: that.currentGroup.groupId
          }
        }
        that
          .$prompt('', title, {
            inputPlaceholder: '请输入',
            inputValue: data.name,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(({ value }) => {
            if (Check.isNullString(value)) {
              that.$message({ message: '分类名称不能为空', type: 'warning' })
              return false
            }
            data.name = value
            CategoryApi.addCategory([data]).then(res => {
              callback && callback(res.categorys)
              that.$message({ type: 'success', message: '操作成功' })
            })
          })
          .catch(() => {})
      },
      handleItem(item) {
        this.editItem(item, '编辑分类')
      },
      handleRemove(item, index) {
        item.status = 'd'
        this.$confirm('确定删除该分类？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CategoryApi.addCategory([item]).then(res => {
            this.list.splice(index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
      },
      handleAdd() {
        this.editItem(null, '添加分类', datas => {
          this.list.push(datas[0])
        })
      }
    }
  }
</script>
