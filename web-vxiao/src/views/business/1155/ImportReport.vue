<template>
  <page title="导入体检报告">
    <div class="import-physical-grades">
      <item class="ipg-time"
            :hasClick="false">
        <div slot="main">体检时间</div>
        <div slot="after">
          <el-date-picker v-model="date"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <div class="button button-common"
           @click="handleImport">导入</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        date: ''
      }
    },
    created() {},
    computed: {
      ...mapGetters({
        physicalExam: 'getPhysicalExam'
      })
    },
    methods: {
      ...mapActions(['setPhysicalExam']),
      handleImport() {
        if (Check.isNullString(this.date)) {
          this.$message({ message: '体检时间不能为空', type: 'warning' })
          return false
        }

        this.$import({
          title: '导入报告',
          uploadURI: `/commons/file/readExcel`,
          templateUrl: `/business/health/download/project/model/${this.currentGroup.parentId}`,
          callback: (res, file) => {
            this.setPhysicalExam({ date: this.date, dataGrids: res.dataGirds })
            this.routePush({ name: 'importView1155' })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .import-physical-grades {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .ipg-time input {
      min-width: initial !important;
    }
  }
</style>
