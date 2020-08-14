<template>
  <Setup appType="'1240'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1240'))" slot="others">
      <item @click="importRecord">
        <div>导入消费记录</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'
import Api from '../api'
export default {
  mixins: [R],
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  methods: {
    importRecord() {
      this.$import({
        title: '导入消费记录',
        uploadURI: this.uploadURL,
        templateUrl: '/static/templates/consumption.xlsx',
        callback: (res, file) => {
          Api.parseTemplate(this.currentGroup.parentId, res.file.id).then(res => {
            this.$message({
              type: 'success',
              message: '导入成功'
            })
          })
        }
      })
    }
  }
}

</script>
