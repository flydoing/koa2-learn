<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <div class="honor-edit">
      <item @click="handleSelectLogo">
        <div slot="main">图标</div>
        <img slot="remark"
             class="avatar"
             v-lazy="{src:logo}"
             alt='LOGO' />
      </item>
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="honor.name" />
      </item>
      <item @click="handleMedal">
        <div slot="main">自动评价</div>
        <div slot="remark"
             v-html="medalTxt"></div>
      </item>
      <item @click="handleRange">
        <div slot="main">适用范围</div>
        <div slot="remark"
             class="ellipsis">{{honor.rangeTxt}}</div>
      </item>
      <div>
        <div class="category-title text">授予规则</div>
        <div v-for="(item,i) in honor.rules"
             :key="i"
             :item="item">
          <item @click="handleRuleSelect(item, i)"
                :hasArrow="false">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':item.active}"></i>
            </div>
            <div slot="main">{{item.name}}</div>
            <div slot="remark"
                 v-if="item.type == 1 || item.type == 2">
              <input class="min-input"
                     :placeholder="item.minPlaceholder"
                     v-model="item.min"
                     @click.stop /> 至
              <input class="min-input"
                     :placeholder="item.maxPlaceHolder"
                     v-model="item.max"
                     @click.stop />
            </div>
          </item>
        </div>
      </div>
      <div>
        <div v-if="honor.rule.type == 1 || honor.rule.type == 2">
          <div class="category-title text">适应项目</div>
          <item @click="handleProjectAll"
                :hasArrow="false">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':honor.all}"></i>
            </div>
            <div slot="main"
                 style="padding-left:0px;">全选</div>
          </item>
          <div class="category-title text"></div>
          <div v-for="(item,i) in honor.projects"
               :key="i"
               :item="item">
            <item @click="handleProjectSelect(item, i)"
                  :hasArrow="false">
              <div slot="before">
                <i class="ico ico-select"
                   :class="{'active':item.active}"></i>
              </div>
              <div slot="main"
                   v-html="projectTxt(item, i + 1, null)"></div>
            </item>
            <item v-for="(child,j) in item.childItems"
                  :key="j"
                  :child="child"
                  :hasArrow="false"
                  @click="handleProjectSelect(child, j)">
              <div slot="before">
                <i class="ico ico-select"
                   :class="{'active':child.active}"></i>
              </div>
              <div slot="main"
                   v-html="projectTxt(child, j + 1, i + 1)"></div>
            </item>
          </div>
        </div>
        <div v-else>
          <div class="category-title text">适应荣誉</div>
          <item v-for="(item,j) in honor.suteHonors"
                :key="j"
                :item="item"
                :hasArrow="false"
                @click="handleHonorSelect(item, j)">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':item.active}"></i>
            </div>
            <div slot="main"
                 v-html="item.name"></div>
            <input slot="remark"
                   class="min-input honor-count"
                   placeholder="达标个数"
                   v-model="item.count"
                   @click.stop />
          </item>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        honor: {
          name: '',
          logo: '',
          suteHonors: [],
          all: false,
          projects: [],
          items: [],
          ranges: [],
          rangeTxt: '',
          medals: [],
          rules: [],
          rule: {}
        }
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      title() {
        return this.rating.cache ? '编辑班级荣誉' : '新建班级荣誉'
      },
      logo() {
        return this.honor ? this.url(this.honor.logo) : ''
      },
      medalTxt() {
        let medals = this.honor.medals
        return medals.length > 0 ? `${medals.length}个` : ''
      }
    },
    methods: {
      ...mapActions(['setRating']),
      fetchData() {
        const that = this
        let cache = that.rating.cache
        let rules = that.initRules()

        if (that.rating.honor) {
          that.honor = JSON.parse(JSON.stringify(that.rating.honor))
          if (that.rating.medals) {
            that.honor.medals = that.rating.medals
          }
        } else if (cache) {
          that.honor = {
            id: cache.id,
            name: cache.name,
            logo: cache.logo,
            rangeTxt: cache.categoryJson,
            ranges: cache.ranges,
            items: cache.relations
              ? cache.relations.map(r => {
                  return { id: r.ratingItemId }
                })
              : [],
            medalRelations: cache.medalRelations,
            medals: cache.categoryIdList
              ? cache.categoryIdList.map(v => {
                  return { id: v }
                })
              : [],
            projects: [],
            rule: {},
            suteHonors: []
          }

          let ruleData = cache.data
          that.honor.rules = rules.map(r => {
            if (r.type === cache.remark) {
              if (ruleData) {
                r.min = ruleData.minValue
                r.max = ruleData.maxValue
              }
              r.active = true
              that.honor.rule = r
            } else {
              r.active = false
            }
            return r
          })

          if (that.honor.rule.type === '3') {
            that.initHonors(that.rating.dayHonors)
          } else if (that.honor.rule.type === '4') {
            that.initHonors(that.rating.weekHonors)
          }
        } else {
          that.honor.rules = rules
          that.honor.rule = rules[0]
        }

        Api.loadProjectData(that.currentGroup.groupId).then(res => {
          let pMap = new Map()
          if (Check.isRealArray(that.honor.items)) {
            that.honor.items.map(c => {
              pMap.set(c.id, c)
            })
          }

          let total = 0
          let count = 0
          that.honor.projects = res.sets.ratingItems.map(p => {
            if (pMap.get(p.id)) {
              p.active = true
              if (p.childItems) {
                p.childItems.map(c => {
                  c.active = true
                })
                count += p.childItems.length
              }
              count++
            } else {
              p.active = false
              if (p.childItems) {
                p.childItems.map(c => {
                  if (pMap.get(c.id)) {
                    c.active = true
                    count++
                  } else {
                    c.active = false
                  }
                })
              }
            }
            total++
            total += p.childItems ? p.childItems.length : 0
            return p
          })

          that.honor.all = count === total
        })
      },
      initRules() {
        let rs = [
          {
            name: '按分值',
            minPlaceholder: '最小',
            maxPlaceHolder: '最大',
            active: false,
            min: '',
            max: '',
            type: '1'
          },
          {
            name: '按名次',
            minPlaceholder: '最低',
            maxPlaceHolder: '最高',
            min: '',
            max: '',
            active: false,
            type: '2'
          }
        ]

        let type = this.routeQuery('type')
        if (type === '1' || type === '2') {
          rs.push({
            name: '按日荣誉',
            active: false,
            type: '3'
          })
        }
        if (type === '2') {
          rs.push({
            name: '按周荣誉',
            active: false,
            type: '4'
          })
        }
        return rs
      },
      initHonors(suteHonors) {
        let mdls = this.honor.medalRelations
        let hMap = new Map()
        if (Check.isRealArray(mdls)) {
          mdls.map(c => {
            hMap.set(c.childCategoryId, c)
          })
        }

        if (Check.isRealArray(suteHonors)) {
          this.honor.suteHonors = suteHonors.map(h => {
            let cache = hMap.get(h.id)
            if (cache) {
              h.active = true
              h.count = cache.count
            } else {
              h.active = false
              h.count = ''
            }
            return h
          })
        }
      },
      handleRuleSelect(rule) {
        this.honor.rules.map(r => {
          r.active = false
        })
        rule.active = !rule.active

        if (rule.type === '3') {
          this.initHonors(this.rating.dayHonors)
        } else if (rule.type === '4') {
          this.initHonors(this.rating.weekHonors)
        }

        this.honor.rule = rule
      },
      handleMedal() {
        this.setRating({ honor: this.honor, medals: this.honor.medals })
        this.routePush({ name: 'selectMedal1049' })
      },
      handleRange() {
        this.setRating({ honor: this.honor })
        this.routePush({ name: 'selectHonorRange1049' })
      },
      handleSelectLogo() {
        this.setRating({ honor: this.honor })
        this.routePush({ name: 'selectLogo1049' })
      },
      projectTxt(item, index, pIndex) {
        if (pIndex) {
          return `${pIndex}.${index} ${item.name}`
        }
        return `${index} ${item.name}`
      },
      handleProjectAll() {
        this.honor.all = !this.honor.all

        let all = this.honor.all
        let caches = []
        this.honor.projects.map(p => {
          p.active = all
          if (p.childItems) {
            p.childItems.map(c => {
              c.active = all
            })
          }
          if (all === true) {
            caches.push(p)
            p.childItems && caches.push(...p.childItems)
          }
          return p
        })
        this.honor.items = caches
      },
      handleProjectSelect(item) {
        item.active = !item.active

        let count = 0
        let total = 0
        let caches = []
        this.honor.projects.map(p => {
          if (p.active) {
            count++
            caches.push(p)
          }

          if (item.id === p.id && p.childItems) {
            p.childItems.map(c => {
              c.active = item.active
            })
            count += p.childItems.length
            caches.push(...p.childItems)
          } else {
            let cCount = 0
            let isChild = false
            if (p.childItems) {
              p.childItems.map(c => {
                if (c.active) {
                  count++
                  cCount++
                  caches.push(c)
                }
                if (item.id === c.id) {
                  isChild = true
                }
              })
            }

            if (isChild) {
              if (p.childItems && cCount === p.childItems.length) {
                p.active = true
                count++
              } else {
                p.active = false
                count--
              }
            }
          }
          total += p.childItems ? p.childItems.length : 0
          total++
          return p
        })
        this.honor.all = count === total
        this.honor.items = caches
      },
      handleHonorSelect(item) {
        this.honor.suteHonors = this.honor.suteHonors.map(h => {
          item.id === h.id && (h.active = !item.active)
          return h
        })
      },
      handleSubmit() {
        let that = this
        let honor = that.honor

        if (Check.isNullString(honor.name)) {
          that.$message({ message: '荣誉名称不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(honor.logo)) {
          that.$message({ message: '荣誉图标不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(honor.ranges)) {
          that.$message({ message: '适应范围不能为空', type: 'warning' })
          return false
        }
        let ranges = honor.ranges.map(r => {
          return { groupId: r.groupId }
        })

        let avRules = honor.rules.filter(r => {
          return r.active
        })
        if (!Check.isRealArray(avRules)) {
          that.$message({ message: '授予规则不能为空', type: 'warning' })
          return false
        }

        let rule = avRules[0]
        if ((rule.type === '1' || rule.type === '2') && (Check.isNullString(rule.min) || Check.isNullString(rule.max))) {
          that.$message({ message: `请输入${rule.minPlaceholder}和${rule.maxPlaceHolder}`, type: 'warning' })
          return false
        }
        if ((rule.type === '1' || rule.type === '2') && parseInt(rule.max) < parseInt(rule.min)) {
          that.$message({ message: `${rule.maxPlaceHolder}必须大于${rule.minPlaceholder}`, type: 'warning' })
          return false
        }

        let honors = []
        let flag = true
        honor.suteHonors.forEach(h => {
          if (h.active === true) {
            if (Check.isNullString(h.count)) {
              flag = false
            } else {
              honors.push({
                childCategoryId: h.id,
                groupId: that.currentGroup.groupId,
                count: h.count,
                remark: rule.type
              })
            }
          }
        })
        if (!flag) {
          that.$message({ message: '适应荣誉的达标个数不能为空', type: 'warning' })
          return false
        }
        if ((rule.type === '3' || rule.type === '4') && !Check.isRealArray(honors)) {
          that.$message({ message: '请选择适应荣誉', type: 'warning' })
          return false
        }

        let projects = honor.items.map(p => {
          return { ratingItemId: p.id }
        })
        if ((rule.type === '1' || rule.type === '2') && !Check.isRealArray(honor.items)) {
          that.$message({ message: '请选择适应项目', type: 'warning' })
          return false
        }

        let postData = {
          groupId: that.currentGroup.groupId,
          relations: projects,
          name: honor.name,
          logo: honor.logo,
          extension: that.routeQuery('type'),
          categoryJson: honor.rangeTxt,
          parentId: that.routeQuery('pId'),
          ranges: ranges,
          medalRelations: honors,
          categoryList: []
        }

        if (Check.isRealArray(honor.medals)) {
          postData.categoryIdList = honor.medals.map(v => {
            return v.id
          })
        }

        if (rule.type === '1' || rule.type === '2') {
          postData.data = {
            minValue: rule.min,
            maxValue: rule.max
          }
        }
        postData.remark = rule.type
        honor.id && (postData.id = honor.id)

        Api.commitHonorData(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .honor-edit {
    .min-input {
      padding: 0 rem(5);
      width: 50px;
      min-width: 50px;
      text-align: center !important;
    }
    .honor-count {
      width: 80px;
      min-width: 80px;
    }
  }
</style>
