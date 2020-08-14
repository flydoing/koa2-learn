<template>
  <page title="颁奖词"
        @submit="handleSubmit"
        hasSubmit>
    <div class="award-content">
      <TextInput placeholder="颁奖词"
                 v-model="award.name"></TextInput>
    </div>
    <div v-if="award.id"
         class="button button-common"
         @click="handleRemoveAward">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        award: {
          name: ''
        }
      }
    },
    created() {
      if (this.commend.cache) {
        this.award = this.commend.cache
      }
    },
    computed: {
      ...mapGetters({
        commend: 'getCommend'
      })
    },
    methods: {
      handleRemoveAward() {
        const that = this
        CategoryApi.addCategory([
          {
            id: that.award.id,
            status: 'd'
          }
        ]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleSubmit() {
        const that = this

        if (Check.isNullString(that.award.name)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = {
          name: that.award.name,
          type: '142',
          groupId: that.currentGroup.groupId
        }
        that.award.id && (postData.id = that.award.id)

        CategoryApi.addCategory([postData]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .award-content {
    textarea {
      height: rem(150);
    }
  }
</style>
