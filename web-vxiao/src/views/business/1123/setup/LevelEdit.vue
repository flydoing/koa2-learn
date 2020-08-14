<template>
  <page :title="title"
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false">
      <div>等级名称</div>
      <input slot="remark"
             type="text"
             placeholder="限5个字"
             v-model="level.name"
             maxlength="5">
    </item>
    <item :hasClick="false">
      <div slot="main"
           v-html="limitTxt"></div>
      <template v-if="level.type!='0'">
        <input slot="remark"
               type="text"
               placeholder="输入分数"
               v-model="level.score">
      </template>
      <template v-else>
        <div slot="remark"
             v-html="level.score"></div>
      </template>
    </item>
    <div v-if="level.id && level.type!='0'"
         class="button button-common"
         @click="handleSubmit(true)">删除</div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        level: {
          name: '',
          score: '',
          type: '1'
        }
      }
    },
    computed: {
      ...mapGetters({
        cacheSettings: 'getSettings',
        exam: 'getExam'
      }),
      title() {
        return this.exam.scoreLevel ? '等级' : '新等级'
      },
      limitTxt() {
        return this.level.type === '1' ? '分数下限' : '分数上限'
      }
    },
    created() {
      if (this.exam.level) {
        this.level = { ...this.exam.level }
        this.deleteExamProp('level')
      }
    },
    methods: {
      ...mapActions(['setExam', 'deleteExamProp']),
      updateLevels(datas, level, isRemove) {
        const that = this
        let score = parseInt(level.score)
        let dts = datas.filter(v => {
          return v.id !== level.id
        })

        if (!isRemove) {
          // 验证是否存在当前设置的分值下限
          let sameLvl = datas.filter(v => {
            return score === v.score && v.type !== '0'
          })[0]
          if (sameLvl) {
            that.$message({ message: '已存在该分值下限', type: 'warning' })
            return false
          }
          dts.push(level)
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
            name: '新等级',
            score: score
          })
        }
        return dts
      },
      handleSubmit(isRemove) {
        const that = this
        let level = this.level
        if (Check.isNullString(level.name)) {
          this.$message({ type: 'warning', message: '等级名称不能为空' })
        }
        if (Check.isNullString(level.score)) {
          this.$message({ type: 'warning', message: '分值不能为空' })
        }

        level.id = level.id || Math.random(0, 999)
        let levels = that.updateLevels(JSON.parse(JSON.stringify(that.exam.setting.childs)), level, isRemove)
        if (!Check.isArray(levels)) {
          return false
        }

        that.setExam({ levels: levels })
        that.routeBack()
      }
    }
  }
</script>
