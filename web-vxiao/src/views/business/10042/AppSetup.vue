<template>
  <Setup>
    <template slot="btns">
      <label @click="handleImport">导入</label>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {}
    },
    created() {},
    computed: {},
    methods: {
      handleImport() {
        this.$import({
          title: '导入报表',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/jyData.xlsx',
          callback: (res, file) => {
            Api.importData({
              groupId: this.currentGroup.groupId,
              fileId: res.file.id
            })
              .then(res => {
                if (res.code === '1') {
                  this.$message.success('导入成功')
                }
              })
              .catch(() => {
                console.log('失败')
              })
          }
        })
      }
    }
  }
</script>
