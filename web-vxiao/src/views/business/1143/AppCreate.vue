<template>
  <page title="新建放学"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="leave-school-create">
      <div class="category-title desc">选择留堂后，将自动通知家长</div>
      <template v-for="(item,i) in list">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleType"
                     :key="i">
          <div class="el-dropdown-link">
            <item>
              <div slot="main"
                   v-html="item.name"></div>
              <div slot="remark"
                   v-html="item.data.data"></div>
            </item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(tp,j) in types"
                              :key="j"
                              :command="{'user': item, 'type': tp, 'index': i}">{{tp.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        list: [],
        types: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        GroupApi.getGroupStudents(that.currentGroup.groupId, '1043').then(res => {
          that.list = res.relations.map(v => {
            v.data = v.data || {
              type: '11',
              data: '放学'
            }
            return v
          })
        })
        CategoryApi.getCategorysByType('111').then(res => {
          that.types = res.categorys
        })
      },
      handleType(item) {
        item.user.data = {
          data: item.type.name,
          type: item.type.status
        }
        this.$set(this.list, item.index, item.user)
      },
      handleSubmit() {
        const that = this

        let datas = that.list.map(v => {
          return JSON.stringify({
            name: v.name,
            data: v.data.data,
            userId: v.userId,
            type: v.data.type
          })
        })

        let postData = that.constructionMessage({
          type: '1143',
          groupId: that.currentGroup.groupId,
          table: { data: datas }
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .leave-school-create {
    .desc {
      text-align: center;
    }
  }
</style>
