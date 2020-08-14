<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false">
      <div slot="main">名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="template.name" />
    </item>
    <item @click="handleResult">
      <div slot="main">评估结果</div>
      <div slot="remark"
           v-html="template.resultTxt"></div>
    </item>
    <div class="category-title text">评估内容</div>
    <ProjectList :list="template.contents"
                 :level="level"
                 v-on:add="projectAdd"
                 v-on:edit="projectEdit"
                 :remarkHandle="remarkTxt"></ProjectList>
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
        template: {
          name: '',
          results: [],
          contents: [],
          resultTxt: ''
        },
        level: 3
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getStudentAppraisal'
      }),
      title() {
        return this.appraisal.tmpCache ? '编辑评估模板' : '新建评估模板'
      }
    },
    components: {
      ProjectList: resolve => require(['@/views/components/project/ProjectList'], resolve)
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      remarkTxt(project, depth) {
        if (depth === 2) {
          return project.weight ? `${project.weight}%` : ''
        } else if (depth === 3) {
          return project.categoryName ? project.categoryName : ''
        }
        return ''
      },
      fetchData() {
        const that = this

        let cache = that.appraisal.tmpCache
        if (that.appraisal.template) {
          that.template = that.appraisal.template
        } else if (cache) {
          Api.loadTemplateDetailById(cache.id).then(res => {
            let model = res.model
            if (model) {
              that.template = {
                ...that.template,
                ...model,
                results: model.results.map(v => {
                  v.id = Math.random(0, 9999)
                  return v
                }),
                resultTxt: `${model.results.length}级`
              }
            }
          })
        }
      },
      handleResult() {
        this.setStudentAppraisal({ template: this.template, results: this.template.results, isTemplate: true })
        this.routePush({ name: 'resultList1196' })
      },
      projectAdd(parent, list, parentIndex, dp, sort) {
        let index = list ? list.length + 1 : 1
        this.setStudentAppraisal({
          template: this.template,
          parent: parent,
          title: parent ? `新建${sort}.${index}项目` : `新建${index}项目`,
          depth: dp,
          pjtCache: null,
          project: null,
          sort: parent ? `${sort}.${index}` : `${index}`
        })
        this.routePush({ name: 'projectEdit1196' })
      },
      projectEdit(project, parent, index, parentIndex, dp, sort) {
        this.setStudentAppraisal({
          template: this.template,
          parent: parent,
          title: parent ? `编辑${sort}.${index}项目` : `编辑${index}项目`,
          depth: dp,
          pjtCache: project,
          project: null,
          sort: parent ? `${sort}.${index}` : `${index}`
        })
        this.routePush({ name: 'projectEdit1196' })
      },
      handleSubmit() {
        const that = this

        let tmp = that.template
        if (Check.isNullString(tmp.name)) {
          that.$message({ message: '模板名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(tmp.results)) {
          that.$message({ message: '请添加评估结果', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(tmp.contents)) {
          that.$message({ message: '请添加项目', type: 'warning' })
          return false
        }

        let results = tmp.results.map(v => {
          return { name: v.name, type: v.type, score: v.score }
        })

        let roleValues = []
        let roleMap = new Map()
        let contents = tmp.contents.map(f => {
          // 二级项目
          if (Check.isRealArray(f.childs)) {
            f.childs = f.childs.map(s => {
              // 三级项目
              if (Check.isRealArray(s.childs)) {
                s.childs = s.childs.map(t => {
                  let rs = t.roles || t.relations
                  if (Check.isRealArray(rs)) {
                    rs = rs.map(v => {
                      let rid = v.roleId ? v.roleId : v.id
                      if (!roleMap.get(rid)) {
                        roleMap.set(rid, v)
                        roleValues.push(v.roleValue)
                      }
                      return {
                        groupId: that.currentGroup.groupId,
                        roleId: rid,
                        roleValue: v.roleValue,
                        name: v.name
                      }
                    })
                  }

                  return {
                    name: t.name,
                    groupId: that.currentGroup.groupId,
                    categoryId: t.categoryId,
                    categoryValue: t.scoreValue ? t.scoreValue : t.categoryValue,
                    relations: rs || []
                  }
                })
              }

              return {
                name: s.name,
                groupId: that.currentGroup.groupId,
                childs: s.childs || [],
                weight: s.weight
              }
            })
          }
          let rs = []
          if (f.results) {
            rs = f.results.map(v => {
              return { name: v.name, groupId: that.currentGroup.groupId, type: v.type, score: v.score }
            })
          }
          return {
            name: f.name,
            groupId: that.currentGroup.groupId,
            childs: f.childs || [],
            levelShow: f.levelShow,
            results: rs
          }
        })

        let postData = {
          name: tmp.name,
          groupId: that.currentGroup.groupId,
          roleJson: roleValues.join(','),
          results: results,
          contents: contents
        }
        tmp.id && (postData.id = tmp.id)

        Api.commitTemplate(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
