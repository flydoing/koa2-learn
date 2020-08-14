<template>
  <page :title="rating.title"
        @submit="handleSubmit"
        closePrompt
        hasSubmit
        :hasClose="false">
    <item :hasClick="false"
          label="项目名称">
      <input slot="remark"
             placeholder="输入内容"
             v-model="project.name" />
    </item>
    <div v-if="rating.depth == 1">
      <item :hasClick="false"
            label="权重">
        <input slot="remark"
               placeholder="0~100"
               v-model="project.weight" />
      </item>
    </div>
    <div v-if="rating.depth == 2 || (rating.depth == 1 && rating.level.type == 1)">
      <item @click="handleRange"
            label="适用范围">
        <div slot="remark"
             class="ellipsis">{{project.rangeTxt}}</div>
      </item>
      <div v-if="rating.way.extension == 'point'">
        <item :hasClick="false"
              label="最小分值">
          <input slot="remark"
                 class="align-right"
                 placeholder="输入分值"
                 v-model="project.minPoint" />
          <div slot="after">分</div>
        </item>
        <item :hasClick="false"
              label="最大分值">
          <input slot="remark"
                 class="align-right"
                 placeholder="输入分值"
                 v-model="project.maxPoint" />
          <div slot="after">分</div>
        </item>
      </div>
      <div v-else-if="rating.way.extension == 'score'">
        <item :hasClick="false"
              label="最大分值">
          <input slot="remark"
                 class="align-right"
                 placeholder="0~100"
                 v-model="project.maxScore" />
          <div slot="after">分</div>
        </item>
      </div>
      <div v-else-if="rating.way.extension == 'self'">
        <div class="category-title text"></div>
        <div v-for="(option,i) in project.options"
             :key="i"
             :option="option">
          <item :hasClick="false">
            <input placeholder="限2字"
                   v-model="option.name" />
            <input slot="remark"
                   class="align-right"
                   placeholder="100以内的整数"
                   v-model="option.extension" />
            <i slot="after"
               class='ico ico-delete'
               @click="handleOptionRmove(i)"></i>
          </item>
        </div>
        <item @click="handleOptionAdd"
              :hasArrow="false"
              label="添加选项">
          <div slot="before">
            <i class="ico ico-plus"></i>
          </div>
        </item>
      </div>
    </div>
    <div v-if="rating.cache"
         class="button button-common"
         @click="handleRemove">删除项目</div>
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
        project: {
          name: '',
          weight: 100,
          minPoint: '',
          maxPoint: '',
          maxScore: '',
          ranges: [],
          rangeTxt: '所有校区',
          options: []
        }
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      fectchData() {
        let cache = this.rating.cache

        if (this.rating.project) {
          this.project = this.rating.project
        } else if (cache) {
          this.project.id = cache.id
          this.project.name = cache.name
          this.project.weight = cache.value ? cache.value * 100 : 100

          if (cache.rule) {
            this.project.minPoint = cache.rule.minPoint
            this.project.maxPoint = cache.rule.maxPoint
            this.project.maxScore = cache.rule.maxScore
          }

          if (cache.childs) {
            this.project.options = cache.childs
          }

          if (cache.useRanges) {
            this.project.ranges = cache.useRanges
          }
          this.project.rangeTxt = cache.flag
        }
      },
      handleRange() {
        this.setRating({ project: this.project })
        this.routePush({ name: 'selectProjectRange1049' })
      },
      handleOptionAdd() {
        if (this.project.options.length === 5) {
          this.$message({ message: '评比选项仅限5个', type: 'warning' })
          return false
        }
        this.project.options.push({ name: '', extension: '' })
      },
      handleOptionRmove(index) {
        this.project.options.splice(index, 1)
      },
      handleRemove() {
        const that = this
        let txt = that.rating.level.type === 1 ? '确定删除该项目及其下级项目？' : '确定删除该项目？'
        that
          .$confirm(txt, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.commitProjectData({ id: that.project.id, status: 'd', groupId: that.currentGroup.groupId }).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this
        let p = that.project
        let rating = that.rating
        let way = that.rating.way

        if (Check.isNullString(p.name)) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }

        let data = {
          name: p.name,
          groupId: that.currentGroup.groupId,
          type: '22',
          remark: rating.level.type === 1 ? 0 : 1,
          parentId: 0
        }
        p.id && (data.id = p.id)

        if (rating.depth === 1) {
          if (Check.isNullString(p.weight)) {
            that.$message({ message: '分数权重不能为空', type: 'warning' })
            return false
          }
          if (p.weight > 100 || p.weight < 0) {
            that.$message({ message: '请输入0~100的分数权重', type: 'warning' })
            return false
          }
          data.value = p.weight / 100
        } else {
          data.parentId = rating.parent.id
          data.value = rating.parent.value
        }

        if (rating.depth === 2 || (rating.depth === 1 && rating.level.type === 1)) {
          if (!Check.isRealArray(p.ranges)) {
            that.$message({ message: '请选择适用范围', type: 'warning' })
            return false
          }
          data.useRanges = p.ranges
          data.flag = p.rangeTxt
          if (way.extension === 'point') {
            let min = parseInt(p.minPoint)
            let max = parseInt(p.maxPoint)
            if (Check.isNullString(p.minPoint)) {
              that.$message({ message: '请输入最小分值', type: 'warning' })
              return false
            }
            if (Check.isNullString(p.maxPoint)) {
              that.$message({ message: '请输入最大分值', type: 'warning' })
              return false
            }
            if (min > max) {
              that.$message({ message: '最小分值不能大于最大分值', type: 'warning' })
              return false
            }
            data.rule = { minPoint: p.minPoint, maxPoint: p.maxPoint }
          } else if (way.extension === 'score') {
            let max = parseInt(p.maxScore)
            if (Check.isNullString(p.maxScore)) {
              that.$message({ message: '最大分值不能为空', type: 'warning' })
              return false
            }
            if (max < 0 || max > 100) {
              that.$message({ message: '请输入0至100的分值', type: 'warning' })
              return false
            }
            data.rule = { maxScore: p.maxScore }
          } else if (way.extension === 'self') {
            if (!Check.isRealArray(p.options)) {
              that.$message({ message: '至少添加一个评比选项', type: 'warning' })
              return false
            }
            if (!that.checkOptionValue('name')) {
              that.$message({ message: '评比选项名称存在空值', type: 'warning' })
              return false
            }
            if (!that.checkOptionValue('extension')) {
              that.$message({ message: '评比选项分值存在空值', type: 'warning' })
              return false
            }
            data.childs = p.options.map(o => {
              o.id && delete o.id
              return {
                ...o,
                type: '50',
                groupId: that.currentGroup.groupId
              }
            })
          }
        }

        if (data.useRanges) {
          data.useRanges = data.useRanges.map(r => {
            r.grades && delete r.grades
            delete r.active
            return r
          })
        }

        Api.commitProjectData(data).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      checkOptionValue(property) {
        let flag = true
        this.project.options.forEach(o => {
          if (Check.isNullString(o[property])) {
            flag = false
            return false
          }
        })
        return flag
      }
    }
  }
</script>
