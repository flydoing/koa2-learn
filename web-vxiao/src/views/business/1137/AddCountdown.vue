<template>
  <page title="新建倒计时"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <div class="countdown-create">
      <item :hasClick="false"
            class="full-input">
        <div slot="main">重大事件名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item class="c-time"
            :hasClick="false">
        <div slot="main">事件日期</div>
        <div slot="after">
          <el-date-picker v-model="form.date"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item @click="handleObject">
        <div slot="main">面向群体</div>
        <div slot="remark"
             v-html="objTxt"></div>
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
          name: '',
          date: '',
          objects: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        countdown: 'getCountdown'
      }),
      objTxt() {
        let objs = this.form.objects
        return objs.length > 0
          ? objs
              .map(v => {
                return v.name
              })
              .join('、')
          : '全部年级'
      }
    },
    methods: {
      ...mapActions(['setCountdown']),
      fetchData() {
        const that = this
        if (that.countdown.form) {
          that.form = { ...that.countdown.form }

          if (that.countdown.objects) {
            that.form.objects = that.countdown.objects
          }
        }
      },
      handleObject() {
        this.setCountdown({ form: this.form, objects: this.form.objects })
        this.routePush({ name: 'selectObject1137' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '重大事件名称不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.date)) {
          that.$message({ message: '事件日期不能为空', type: 'warning' })
          return false
        }

        let objs = []
        if (Check.isRealArray(form.objects)) {
          form.objects.map(v => {
            objs.push({ groupId: v.groupId })
          })
        }

        let postData = that.constructionMessage({
          type: '1137',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify(objs),
          times: [
            {
              type: 'end',
              setTime: DateUtils.format_0800(form.date)
            }
          ],
          content: form.name,
          extension: objs.length > 0 ? that.objTxt.substring(0, that.objTxt.length - 2) : ''
        })

        this.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.setCountdown({ form: null })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .countdown-create {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .c-time input {
      min-width: initial !important;
    }
  }
</style>
