<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          label="显示简称">
      <input slot="remark"
             placeholder="必填"
             maxlength="1"
             v-model="form.title" />
    </item>
    <item :hasClick="false"
          label="果实分值">
      <input slot="remark"
             placeholder="必填"
             v-model="form.score" />
      <div slot="after">分</div>
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
        form: {
          title: '',
          score: ''
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.form.dimensionName || ''
      }
    },
    methods: {
      ...mapActions(['modifyCreateObjectField']),
      fectchData() {
        if (this.obj.dimension) {
          this.form = { ...this.obj.dimension }
          this.modifyCreateObjectField('dimension')
        }
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.score)) {
          that.$message({ message: '分值不能为空', type: 'warning' })
          return false
        }
        Api.saveDimesionSets({
          fruitMetas: [form]
        }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .dimension-edit {
    .el-upload {
      display: block !important;
    }
  }
</style>
