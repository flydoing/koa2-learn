<template>
  <page title="请假审批规则">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleItem(item, i)"
          :label="item.name"
          :reamrk="remarkTxt(item, i)">
    </item>
    <item @click="handleAdd"
          :hasArrow="false"
          label="新规则">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

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
        leave: 'getLeave'
      })
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
    methods: {
      ...mapActions(['setLeave']),
      remarkTxt(item, index) {
        return index === this.list.length - 1 ? `上限${item.days}天` : `大于${item.days}天`
      },
      handleAdd() {
        this.routePush({ name: 'ruleEdit1235' })
      },
      handleItem(item, i) {
        this.setLeave({ item: item })
        this.routePush({ name: 'ruleEdit1235' })
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
