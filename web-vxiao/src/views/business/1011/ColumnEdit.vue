<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item :hasClick="false"
          :hasArrow="false"
          class="full-input">
      <div slot="main">
        <input placeholder="栏目名称"
               v-model="column.name" />
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
          name: ''
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      }),
      title() {
        return this.active.title || ''
      }
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
        if (Check.isNullString(that.column.name)) {
          that.$message({ message: '栏目名称不能为空', type: 'warning' })
          return false
        }

        let postData = null
        let parent = that.active.parent
        if (parent) {
          postData = {
            category: { id: parent.id, status: '1' },
            subCategory: [
              {
                id: that.column.id ? that.column.id : null,
                groupId: that.currentGroup.groupId,
                parentId: parent.id,
                type: 'portal_menu',
                name: that.column.name,
                status: '1'
              }
            ]
          }
        } else {
          postData = {
            category: {
              groupId: that.currentGroup.groupId,
              parentId: 0,
              type: 'portal_menu',
              name: that.column.name,
              status: '1'
            }
          }
          that.column.id && (postData.category.id = that.column.id)
        }

        Api.commitColumn([postData]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
