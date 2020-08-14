<template>
  <page title="请假类型设置"
        closePrompt
        @add="modifyType"
        hasAdd>
    <item v-for="(item, i) in list"
          :key="i"
          @click="modifyType(item, i)"
          :hasClick="item.groupId!==undefined"
          :label="item.name">
      <i v-if="item.groupId"
         slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item,i)"></i>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      CategoryApi.getCategorys({
        type: '36',
        groupId: this.groupId,
        isDefault: 1
      }).then(res => {
        this.list = res.categorys
      })
    },
    computed: {},
    methods: {
      modifyType(item, index) {
        const that = this
        this.$prompt(' ', '添加', {
          inputPlaceholder: '类型名称',
          inputValue: item ? item.name : '',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            that.$message({ message: '类型名称不能为空', type: 'warning' })
            return false
          }
          let postData = null
          if (item) {
            postData = { ...item, name: value }
          } else {
            postData = {
              name: value,
              groupId: that.groupId,
              status: '1',
              type: '36'
            }
          }
          CategoryApi.addCategory([postData]).then(res => {
            if (item) {
              that.$set(this.list, index, res.categorys[0])
            } else {
              that.list.push(res.categorys[0])
            }
            that.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleRemove(item, index) {
        this.$confirm('确定删除该类型？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CategoryApi.addCategory([
            {
              id: item.id,
              groupId: this.groupId,
              status: 'd'
            }
          ]).then(res => {
            this.list.splice(index, 1)
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      }
    }
  }
</script>
