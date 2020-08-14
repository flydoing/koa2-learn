<template>
  <page title="编辑跳转链接"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item className="vx-item-show"
          :hasClick="false">
      <div slot="main">
        <input placeholder="链接地址"
               v-model="column.extension" />
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        column: {
          extension: ''
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fectchData() {
        if (this.active.column) {
          this.column = this.active.column
        }
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.column.extension)) {
          that.$message({ message: '链接地址不能为空', type: 'warning' })
          return false
        }

        let parent = that.active.parent
        let postData = {
          category: { id: parent.id, status: '1' },
          subCategory: [
            {
              id: that.column.id,
              groupId: that.currentGroup.groupId,
              parentId: parent.id,
              type: 'portal_menu',
              extension: that.column.extension,
              status: '1'
            }
          ]
        }
        Api.commitColumn([postData]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
