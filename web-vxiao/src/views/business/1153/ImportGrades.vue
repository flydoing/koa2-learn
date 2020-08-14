<template>
  <page title="导入体测成绩">
    <div class="import-physical-grades">
      <item class="ipg-time"
            :hasClick="false">
        <div slot="main">体测时间</div>
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
        physicalTest: 'getPhysicalTest'
      })
    },
    methods: {
      ...mapActions(['setPhysicalTest']),
      handleImport() {
        if (Check.isNullString(this.date)) {
          this.$message({ message: '体测时间不能为空', type: 'warning' })
          return false
        }

        this.$import({
          title: '导入成绩',
          uploadURI: `${this.$store.state.FILE_URL}/readExcel`,
          templateUrl: `/business/physical/download/model/${this.currentGroup.parentId}`,
          callback: (res, file) => {
            this.setPhysicalTest({ date: this.date, dataGrids: res.dataGirds })
            this.routePush({ name: 'importView1153' })
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
