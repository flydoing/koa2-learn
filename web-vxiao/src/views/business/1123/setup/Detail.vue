<template>
  <page :title="title"
        hasSubmit
        @submit="handleSubmit">
    <div class="exam-settings">
      <div v-for="(item, i) in settings"
           :key="i">
        <item :hasClick="false">
          <div slot="main">满分</div>
          <input slot="remark"
                 type="text"
                 v-model="item.total" />
        </item>
        <item @click="handleSubject(item)">
          <div>适应科目</div>
          <div slot="remark"
               class="ellipsis"
               v-html="subjectTxt(item)"></div>
        </item>
        <item v-for="(child, j) in item.childs"
              :key="j"
              @click="handleScoreLevel(item, child)">
          <div slot="main"
               v-html="child.name"></div>
          <div slot="remark"
               v-html="scoreTxt(child)"></div>
        </item>
        <item @click="handleAddScoreLevel(item)">
          <div>新等级</div>
        </item>
        <item @click="handleSection(item)">
          <div>分数段统计</div>
          <div slot="remark"
               v-html="item.sectionScore"></div>
        </item>
        <div class="button button-common"
             @click="handleRemove(i)">删除</div>
        <div class="category-title"></div>
      </div>
      <item @click="handleAdd">
        <div>新满分</div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        settings: [],
        subjects: [],
        defaultSetting: null
      }
    },
    computed: {
      ...mapGetters({
        exam: 'getExam'
      }),
      title() {
        return this.routeQuery('gradeName') || ''
      }
    },
    created() {
      if (Check.isRealArray(this.exam.settings)) {
        this.settings = JSON.parse(JSON.stringify(this.exam.settings))
        if (this.exam.setting) {
          let set = this.exam.setting
          if (this.exam.levels) {
            set = { ...set, childs: this.sortData(this.exam.levels) }
            this.deleteExamProp('levels')
          }
          this.settings = this.settings.map((v) => {
            if (v.id === set.id) {
              return set
            }
            return v
          })
          this.deleteExamProp('setting')
        }
        this.deleteExamProp('settings')
      } else {
        Api.loadSettingDetail(this.routeQuery('grade'), this.groupId).then((res) => {
          this.settings = res.settings.map((v) => {
            v.id = Math.random(1, 999)
            v.childs = v.childs.map((c) => {
              c.type = c.isBottom ? '0' : '1'
              c.score = c.type === '0' ? c.ceiling : c.floor
              c.name = c.value
              c.id = Math.random(1, 999)
              return c
            })
            return v
          })
        })
      }
      CategoryApi.getCategorys({
        groupId: this.groupId,
        type: '1',
        isDefault: '1'
      }).then((res) => {
        if (res.categorys) {
          this.subjects = res.categorys
        }
      })
      Api.loadSettingDetail(this.routeQuery('grade'), this.groupId, 1).then((res) => {
        this.defaultSetting = res.settings[0]
      })
    },
    methods: {
      ...mapActions(['setExam', 'deleteExamProp']),
      subjectTxt(item) {
        if (Check.isRealArray(item.subjects)) {
          return item.subjects
            .map((v) => {
              return v.name
            })
            .join('、')
        }
        return ''
      },
      scoreTxt(item) {
        return item.type !== '0' ? `${item.score}以上` : `${item.score}以下`
      },
      // 比较分数高低
      compareScore(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      // 数据排序
      sortData(datas) {
        // 最低值
        let lowest = datas.filter((v) => {
          return v.type !== '1'
        })[0]
        let dts = datas.filter((v) => {
          return v.type !== '0'
        })
        // 数据排序
        dts.sort(this.compareScore('score')).reverse()
        dts.push(lowest)
        return dts
      },
      handleAddScoreLevel(item) {
        this.setExam({ settings: this.settings, setting: item })
        this.routePush({ name: 'levelEdit1123' })
      },
      handleScoreLevel(item, level) {
        this.setExam({ settings: this.settings, setting: item, level: level })
        this.routePush({ name: 'levelEdit1123' })
      },
      handleSubmit() {
        let hasEmptyLevel = false
        let hasEmptySubject = false
        let flag = false
        let sets = []
        this.settings.forEach((v, i) => {
          let childs = []
          let subjects = []
          if (Check.isRealArray(v.childs)) {
            if (v.childs[0].score > v.total) {
              flag = true
            }
            childs = v.childs.map((c) => {
              if (c.type === '0') {
                return {
                  ceiling: c.score,
                  value: c.name
                }
              }
              return {
                floor: c.score,
                value: c.name
              }
            })
          } else {
            hasEmptyLevel = true
          }
          v.level = i + 1
          if (Check.isRealArray(v.subjects)) {
            subjects = v.subjects.map((s) => {
              return {
                isSelect: '1',
                id: s.id,
                name: s.name
              }
            })
          } else {
            hasEmptySubject = true
          }
          sets.push({ ...v, childs: childs, subjects: subjects })
        })
        if (flag) {
          this.$message({ type: 'warning', message: '最高等级分数不能大于满分' })
          return false
        }
        if (hasEmptyLevel) {
          this.$message({ type: 'warning', message: '满分等级不能为空' })
          return false
        }
        if (hasEmptySubject) {
          this.$message({ type: 'warning', message: '适应科目不能为空' })
          return false
        }
        Api.addSetting({
          grade: this.routeQuery('grade'),
          groupId: this.groupId,
          settings: sets.map((v) => {
            delete v.id
            return v
          })
        }).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      // 获取未选科目
      getUnselectedSubjects() {
        let subs = []
        this.settings.map((v) => {
          if (Check.isRealArray(v.subjects)) {
            v.subjects.map((s) => {
              subs.push(s)
            })
          }
        })
        let sMap = new Map()
        if (Check.isRealArray(subs)) {
          subs.map((v) => {
            sMap.set(v.id, v)
          })
        }
        return this.subjects.filter((v) => {
          return Check.isNullObject(sMap.get(v.id))
        })
      },
      handleSubject(item) {
        // 未选科目列表
        let unselected = this.getUnselectedSubjects()
        this.setExam({ settings: this.settings, setting: item, unselected: unselected })
        this.routePush({
          name: 'selectSubject1123'
        })
      },
      handleAdd() {
        let unselected = this.getUnselectedSubjects()
        if (unselected < 1) {
          this.$message({ type: 'warning', message: '无可选科目' })
          return false
        }
        if (this.defaultSetting) {
          let set = JSON.parse(JSON.stringify(this.defaultSetting))
          set.id = Math.random(1, 999)
          set.childs = set.childs.map((c) => {
            c.type = c.isBottom ? '0' : '1'
            c.score = c.type === '0' ? c.ceiling : c.floor
            c.name = c.value
            c.id = Math.random(1, 999)
            return c
          })
          this.settings.push(set)
        }
      },
      handleRemove(index) {
        this.$confirm('确认删除该满分？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.settings.splice(index, 1)
        })
      },
      handleSection(item) {
        this.setExam({ settings: this.settings, setting: item })
        this.routePush({
          name: 'scoreSection1123'
        })
      }
    }
  }
</script>
