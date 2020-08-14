<template>
  <Page title="新建排考"
        listenBack
        closePrompt
        @back="back">
    <label slot="btn"
           @click="handleImport">导入</label>
    <div class="examPlace-arrange">
      <item :hasClick="false">
        <div slot="main">考试名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item :hasClick="false">
        <div slot="main">开始时间</div>
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"
                          :clearable="false"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">结束时间</div>
        <div slot="after">
          <el-date-picker v-model="form.endTime"
                          prefix-icon="x"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"
                          :clearable="false"></el-date-picker>
        </div>
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    created() {
      if (this.arrange.form) {
        this.form = { ...this.arrange.form }
      }
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      handleImport() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '考试名称不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.startTime) || Check.isNullString(form.endTime)) {
          that.$message({ message: '考试时间不能为空', type: 'warning' })
          return false
        }

        that.$import({
          title: '导入',
          uploadURI: `/commons/file/readExcel`,
          templateUrl: `/static/templates/examPlaceArrange.xls`,
          callback: (res, file) => {
            that.setArrangeExam({ form: this.form, tableDatas: res.dataGirds[0].data })
            that.routePush({
              name: 'importView1164',
              query: { msgType: 5 }
            })
          }
        })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$router.go(-2)
        })
      }
    }
  }
</script>
