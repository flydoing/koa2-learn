<template>
  <page :title="appraisal.title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false">
      <div slot="main">项目名称</div>
      <input slot="remark"
             placeholder="输入内容"
             v-model="project.name" />
    </item>
    <div v-if="appraisal.depth == 1">
      <item @click="handleResult">
        <div slot="main">评估结果</div>
        <div slot="remark"
             v-html="project.resultTxt"></div>
      </item>
      <item>
        <div slot="main">显示分数结果</div>
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch(project.levelShow)"></i-switch>
        </div>
      </item>
    </div>
    <div v-else-if="appraisal.depth == 2">
      <item :hasClick="false">
        <div slot="main">权重</div>
        <input slot="remark"
               placeholder="0~100"
               v-model="project.weight" />
        <div slot="after">%</div>
      </item>
    </div>
    <div v-else>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleWay">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">评估方式</div>
            <div v-if="project.way"
                 slot="remark">{{project.way.name}}</div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in ways"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="category-title text">评估人</div>
      <item v-for="(item,i) in project.roles"
            :key="i"
            :hasArrow="false"
            @click="handleSelect(item, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.active}"></i>
        </div>
        <div slot="main">{{item.name}}</div>
      </item>
    </div>
    <div v-if="appraisal.pjtCache"
         class="button button-common"
         @click="handleRemove">删除项目</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        project: {
          name: '',
          weight: 100,
          levelShow: '1',
          way: null,
          roles: [],
          results: [],
          resultTxt: ''
        },
        ways: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getStudentAppraisal'
      }),
      isSwitched() {
        return this.project.levelShow === '1'
      }
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fectchData() {
        const that = this
        let cache = that.appraisal.pjtCache
        let depth = that.appraisal.depth
        let roleMap = new Map()

        if (that.appraisal.project) {
          that.project = { ...that.appraisal.project }
        } else {
          if (cache) {
            that.project = { ...that.project, ...cache }
            if (depth === 1) {
              that.project.results = cache.results ? cache.results : that.appraisal.results
              that.project.resultTxt = that.project.results ? `${that.project.results.length}级` : ''
            } else if (depth === 3) {
              if (Check.isRealArray(cache.relations)) {
                cache.relations.map(v => {
                  roleMap.set(v.roleId, v)
                })
              }
              if (Check.isRealArray(cache.roles)) {
                cache.roles.map(v => {
                  roleMap.set(v.id, v)
                })
              }

              that.project.way = {
                id: cache.categoryId,
                name: cache.categoryName,
                value: cache.categoryValue,
                score: cache.scoreValue || 0
              }
            }
          }

          if (depth === 3) {
            Api.loadProjectRoles(that.currentGroup.groupId).then(res => {
              that.project = {
                ...that.project,
                roles: res.roles.map(v => {
                  roleMap.get(v.id) ? (v.active = true) : (v.active = false)
                  return v
                })
              }
            })
          }
        }

        if (depth === 3) {
          CategoryApi.getCategorysByType('147').then(res => {
            that.ways = res.categorys
          })
        }
      },
      handleSwitch(value) {
        this.project.levelShow = value === '1' ? '0' : '1'
      },
      handleResult() {
        this.setStudentAppraisal({ project: this.project, results: this.project.results, isTemplate: false })
        this.routePush({ name: 'resultList1196' })
      },
      handleRemove() {
        const that = this
        let txt = that.appraisal.depth === 1 ? '确定删除该项目及其下级项目？' : '确定删除该项目？'
        that
          .$confirm(txt, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            let tmp = JSON.parse(JSON.stringify(that.appraisal.template))
            let depth = that.appraisal.depth
            let sort = that.appraisal.sort

            let s = sort.split('.') // 截断序号获取项目数据下标
            let fIndex = s[0] ? parseInt(s[0]) - 1 : 0 // 一级项目下标
            let sIndex = s[1] ? parseInt(s[1]) - 1 : 0 // 二级项目下标
            let tIndex = s[2] ? parseInt(s[2]) - 1 : 0 // 三级项目下标

            switch (depth) {
              case 1:
                tmp.contents.splice(fIndex, 1)
                break
              case 2:
                tmp.contents[fIndex].childs.splice(sIndex, 1)
                break
              case 3:
                tmp.contents[fIndex].childs[sIndex].childs.splice(tIndex, 1)
                break
              default:
                break
            }
            that.setStudentAppraisal({ template: tmp })
            that.routeBack()
          })
      },
      handleWay(item) {
        const that = this
        if (item.flag === '6') {
          let way = that.project.way
          that.setStudentAppraisal({ project: that.project, way: way && way.score ? way : item, wayName: item.name })
          that.routePush({ name: 'scoreEdit1196' })
        } else {
          that.project.way = item
        }
      },
      handleSelect(item) {
        item.active = !item.active
      },
      handleSubmit() {
        const that = this
        let cache = that.appraisal.pjtCache
        let tmp = JSON.parse(JSON.stringify(that.appraisal.template))
        let depth = that.appraisal.depth
        let sort = that.appraisal.sort
        let project = that.project

        let s = sort.split('.') // 截断序号获取项目数据下标
        let fIndex = s[0] ? parseInt(s[0]) - 1 : 0 // 一级项目下标
        let sIndex = s[1] ? parseInt(s[1]) - 1 : 0 // 二级项目下标
        let tIndex = s[2] ? parseInt(s[2]) - 1 : 0 // 三级项目下标

        let p = { name: project.name }
        if (Check.isNullString(p.name)) {
          that.$message({ message: '项目名称不能为空', type: 'warning' })
          return false
        }
        project.id && (p.id = project.id)

        switch (depth) {
          case 1:
            p = { ...p, levelShow: project.levelShow, results: project.results }
            if (cache) {
              let original = tmp.contents[fIndex]
              tmp.contents.splice(fIndex, 1, { ...original, ...p })
            } else {
              tmp.contents.push(p)
            }
            break
          case 2:
            if (Check.isNullString(project.weight)) {
              that.$message({ message: '权重不能为空', type: 'warning' })
              return false
            }
            if (parseInt(project.weight) > 100 || parseInt(project.weight) < 1) {
              that.$message({ message: '权重不能超出数值限制（1~100）', type: 'warning' })
              return false
            }
            p = { ...p, weight: project.weight }
            if (cache) {
              let original = tmp.contents[fIndex].childs[sIndex]
              tmp.contents[fIndex].childs.splice(sIndex, 1, { ...original, ...p })
            } else {
              if (tmp.contents[fIndex].childs) {
                tmp.contents[fIndex].childs.push(p)
              } else {
                tmp.contents[fIndex].childs = [p]
              }
            }
            break
          case 3:
            if (!project.way) {
              that.$message({ message: '请选择评估方式', type: 'warning' })
              return false
            }
            let roles = project.roles.filter(v => {
              return v.active
            })
            if (!Check.isRealArray(roles)) {
              that.$message({ message: '请选择评估人', type: 'warning' })
              return false
            }
            p = {
              ...p,
              categoryId: project.way.id,
              categoryName: project.way.name,
              categoryValue: project.way.value,
              scoreValue: project.way.score,
              roles: roles
            }
            if (cache) {
              let original = tmp.contents[fIndex].childs[sIndex].childs[tIndex]
              tmp.contents[fIndex].childs[sIndex].childs.splice(tIndex, 1, { ...original, ...p })
            } else {
              if (tmp.contents[fIndex].childs[sIndex].childs) {
                tmp.contents[fIndex].childs[sIndex].childs.push(p)
              } else {
                tmp.contents[fIndex].childs[sIndex].childs = [p]
              }
            }
            break
          default:
            break
        }
        that.setStudentAppraisal({ template: tmp })
        that.routeBack()
      }
    }
  }
</script>
