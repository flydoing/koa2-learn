<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item :hasClick="false">
      <div slot="main">
        <input placeholder="栏目名称"
               v-model="column.name" />
      </div>
    </item>
    <div v-if="column.id"
         class="button button-common"
         @click="handleRemove">删除栏目</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
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
        security: 'getSecurity'
      }),
      title() {
        return this.security.column ? '编辑栏目' : '新建栏目'
      }
    },
    methods: {
      ...mapActions(['setSecurity']),
      fectchData() {
        if (this.security.column) {
          this.column = this.security.column
        }
      },
      handleSubmit() {
        const that = this
        let column = that.column
        if (Check.isNullString(column.name)) {
          that.$message({ message: '栏目名称不能为空', type: 'warning' })
          return false
        }

        let postData = {
          group: that.currentGroup.groupId,
          type: '116',
          name: column.name
        }
        that.column.id && (postData.id = column.id)

        CategoryApi.addCategory([postData]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleRemove() {
        const that = this
        Api.removeColumnById(that.column.id).then(res => {
          if (res.msgCount < 1) {
            CategoryApi.addCategory([{ ...that.column, status: 'd' }]).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          } else {
            that.$message({ message: '本栏目存在文章，无法删除', type: 'warning' })
          }
        })
      }
    }
  }
</script>
