<template>
  <page title="新建评价总结"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <div class="evaluate-summary-create">
      <item @click="handleRange">
        <div slot="main"> 总结范围</div>
        <div slot="remark"
             v-html="rangeTxt"></div>
      </item>
      <item class="es-time"
            :hasClick="false">
        <div slot="main"> 截止时间</div>
        <div slot="after">
          <el-date-picker v-model="form.deadline"
                          prefix-icon="x"
                          :clearable="false"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"></el-date-picker>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          deadline: '',
          ranges: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        summary: 'getApslSummary'
      }),
      rangeTxt() {
        let rs = this.form.ranges
        return rs.length > 0 ? `${rs.length}个年级` : ''
      }
    },
    methods: {
      ...mapActions(['setApslSummary']),
      fetchData() {
        const that = this
        if (that.summary.form) {
          that.form = { ...that.summary.form }

          if (that.summary.ranges) {
            that.form.ranges = that.summary.ranges
          }
        }
      },
      handleRange() {
        this.setApslSummary({ form: this.form, ranges: this.form.ranges })
        this.routePush({ name: 'selectRange1222' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (!Check.isRealArray(form.ranges)) {
          that.$message({ message: '请选择总结范围', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.deadline)) {
          that.$message({ message: '截止时间不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1222',
          groupId: that.currentGroup.groupId,
          msgJson: form.ranges
            .map(v => {
              return v.id
            })
            .join(','),
          times: [
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.deadline)
            }
          ]
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setApslSummary({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .evaluate-summary-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .es-time input {
      min-width: initial !important;
    }
  }
</style>
