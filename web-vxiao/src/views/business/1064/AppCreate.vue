<template>
  <page title="新建工资单"
        closePrompt
        @back="handleBack"
        listenBack>
    <div class="payroll-create">
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="工资单名称"
               v-model="form.name" />
      </item>
      <item @click="handleGroup">
        <div slot="main">关联群组</div>
        <div slot="remark"
             v-html="groupTxt"></div>
      </item>
      <div class="button button-common"
           @click="handleImport">导入</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          groups: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        payroll: 'getPayroll'
      }),
      groupTxt() {
        let gs = this.form.groups
        return gs.length > 0 ? `${gs.length}个群组` : ''
      }
    },
    methods: {
      ...mapActions(['setPayroll']),
      fetchData() {
        if (this.payroll.form) {
          this.form = { ...this.payroll.form }
          if (this.payroll.groups) {
            this.form.groups = this.payroll.groups
          }
        }
      },
      handleGroup() {
        this.setPayroll({ form: this.form, groups: this.form.groups })
        this.routePush({ name: 'selectGroup1064' })
      },
      handleImport() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.groups)) {
          that.$message({ message: '请选择关联群组', type: 'warning' })
          return false
        }

        let tempUrl = '/business/wages/download/model?'
        form.groups.map(v => {
          tempUrl += `groupId=${v.groupId}&`
        })

        that.$import({
          title: '导入工资单',
          uploadURI: `${this.$store.state.FILE_URL}/readExcel`,
          templateUrl: tempUrl,
          callback: (res, file) => {
            that.setPayroll({ form: this.form, dataGrids: res.dataGirds })
            that.routePush({ name: 'importView1064' })
          }
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
