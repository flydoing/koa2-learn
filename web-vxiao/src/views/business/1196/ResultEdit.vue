<template>
  <page :title="title"
        @submit="handleSubmit(false)"
        hasSubmit
        :hasClose="false">
    <div class="result-edit">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               placeholder="输入内容"
               v-model="result.name" />
      </item>
      <item v-if="result.type!='0'"
            :hasClick="false">
        <div slot="main">分值下限</div>
        <div slot="remark">
          <input placeholder="输入内容"
                 v-model="result.score" />分以上
        </div>
      </item>
      <div v-if="result.id && result.type!='0'"
           class="button button-common"
           @click="handleSubmit(true)">删除标准</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        result: {
          name: '',
          score: '',
          type: '1'
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getStudentAppraisal'
      }),
      title() {
        return this.appraisal.result ? '编辑标准' : '新建标准'
      }
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fectchData() {
        if (this.appraisal.result) {
          this.result = { ...this.appraisal.result }
        }
      },
      updateResults(datas, result, isRemove) {
        const that = this
        let score = parseInt(result.score)
        let dts = datas.filter(v => {
          return v.id !== result.id
        })

        if (!isRemove) {
          // 验证是否存在当前设置的分值下限
          let sameRlt = datas.filter(v => {
            return score === v.score && v.type !== '0'
          })[0]
          if (sameRlt) {
            that.$message({ message: '已存在该分值下限', type: 'warning' })
            return false
          }
          dts.push(result)
        }

        // 验证是否存在普通标准
        let others = dts.filter(v => {
          return v.type !== '0'
        })
        if (!Check.isRealArray(others)) {
          return []
        }

        // 获取自动生成的最低标准
        let lowest = dts.filter(v => {
          return v.type !== '1'
        })[0]
        if (lowest) {
          // 更新自动生成的最低标准分值
          let scores = others.map(v => {
            return v.score
          })
          let min = Math.min.apply(null, scores)

          dts = dts.map(v => {
            if (v.type === '0') {
              v.score = min
            }
            return v
          })
        } else {
          dts.push({
            id: Math.random(0, 9999),
            type: '0',
            name: '新标准',
            score: score,
            groupId: that.currentGroup.groupId
          })
        }
        return dts
      },
      handleSubmit(isRemove) {
        const that = this

        let r = that.result
        r.id = r.id || Math.random(0, 9999)

        let results = that.updateResults(JSON.parse(JSON.stringify(that.appraisal.results)), r, isRemove)
        if (!Check.isArray(results)) {
          return false
        }

        that.setStudentAppraisal({ results: results, result: null })
        that.routeBack()
      }
    }
  }
</script>
