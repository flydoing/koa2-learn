<template>
  <Page :title="title"
        :hasSubmit="hasSubmit"
        @submit="handleSubmit">
    <template v-if="column==='score'">
      <Item :hasClick="false">
        <div slot="main">积分</div>
        <input slot="remark"
               placeholder="输入分值"
               v-model="score" />
      </Item>
    </template>
    <template v-else-if="column==='limit'">
      <Item :hasClick="false">
        <div slot="main">上限</div>
        <input slot="remark"
               placeholder="输入人数"
               v-model="limit" />
      </Item>
    </template>
    <template v-else-if="column==='level'">
      <div class="category-title text">优先级越高，排课越靠前</div>
      <item v-for="(item, i) in levels"
            :key="i"
            @click="handlevel(item)">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-if="i===0">最高</div>
      </item>
    </template>
    <template v-else-if="column==='property'">
      <item v-for="(item, i) in properties"
            :key="i"
            @click="handleProperty(item)">
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </template>
    <template v-else-if="column==='mutex'">
      <item v-for="(item, i) in subjects"
            :key="i"
            :hasArrow="false"
            @click="handleSubject(item)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </template>
    <template v-else-if="column==='complementation'">
      <item v-for="(item, i) in subjects"
            :key="i"
            @click="handleSubject(item)">
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </template>
    <template v-else-if="column==='node'">
      <item v-for="(item, i) in nodes"
            :key="i"
            @click="handleNode(item)">
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </template>
    <template v-else>
      <Item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               placeholder="输入内容"
               v-model="name" />
      </Item>
      <item v-if="subject.courseId!==0"
            @click="handleCategory">
        <div slot="main">科目类别</div>
        <div slot="remark"
             v-html="categoryTxt"></div>
      </item>
      <div v-if="subject.courseId!==0"
           class="button button-common"
           @click="handleRemove">删除</div>
    </template>
  </Page>
</template>
<script>
  import Api from '../api'
  import CategroyApi from '@/api/category'
  import ExamApi from '@/views/business/1123/api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        subject: null,
        type: '',
        column: '',
        limit: '',
        name: '',
        levels: [],
        properties: [],
        score: '',
        subjects: [],
        nodes: [],
        category: null
      }
    },
    computed: {
      title() {
        return this.routeQuery('title')
      },
      categoryTxt() {
        return this.category ? this.category.name : ''
      },
      hasSubmit() {
        let col = this.column
        return col === 'name' || col === 'score' || col === 'mutex' || col === 'limit'
      }
    },
    created() {
      let subject = this.getStorage('_cache_subject')
      if (Check.isObject(subject)) {
        this.subject = subject
        if (subject.courseId) {
          this.name = subject.courseName
          ExamApi.getSubjects(this.groupId, subject.courseId).then(res => {
            if (res.categorys) {
              this.category = {
                name: res.categorys[0].parentName,
                id: res.categorys[0].parentId
              }
            }
          })
        }
      }

      let column = this.getStorage('_cache_subject_column')
      if (column === 'mutex' || column === 'complementation') {
        let sMap = new Map()
        let subs = this.getStorage('_cache_subject_subjects')
        if (Check.isRealArray(subs)) {
          subs.map(v => {
            sMap.set(v.id)
          })
        }
        CategroyApi.getCategorys({ type: '1', groupId: this.groupId }).then(res => {
          this.subjects = res.categorys.map(v => {
            return { ...v, selected: Check.isObject(sMap.get(v.id)) }
          })
        })
      } else if (column === 'level') {
        CategroyApi.getCategorys({ type: '110' }).then(res => {
          this.levels = res.categorys
        })
      } else if (column === 'property') {
        this.properties = [{ name: '必修', value: '1' }, { name: '选修', value: '2' }, { name: '文科必修', value: '3' }, { name: '理科必修', value: '4' }]
      } else if (column === 'node') {
        for (let i = 0; i <= 15; i++) {
          this.nodes.push({ name: `每周${i}节`, value: i })
        }
      } else if (column === 'limit') {
        this.limit = this.getStorage('_cache_subject_limit') || ''
      } else {
        let score = this.getStorage('_cache_subject_score')
        this.score = score || ''
      }
      this.column = column
    },
    methods: {
      commitData(postData) {
        Api.modifySubject(postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleProperty(item) {
        let s = this.subject
        this.commitData({
          course: {
            id: s.courseId,
            groupId: this.groupId
          },
          attr: {
            groupId: this.groupId,
            categoryId: s.courseId,
            nature: item.value
          }
        })
      },
      handleSubject(item, index) {
        if (this.column === 'mutex') {
          item.selected = !item.selected
          this.$set(this.subjects, index, item)
        } else {
          let s = this.subject
          this.commitData({
            course: {
              id: s.courseId,
              groupId: this.groupId
            },
            relations: [
              {
                groupId: this.groupId,
                type: '2',
                categoryId: s.courseId,
                relationId: item.id
              }
            ]
          })
        }
      },
      handlevel(item) {
        let s = this.subject
        this.commitData({
          course: {
            id: s.courseId,
            groupId: this.groupId
          },
          attr: {
            groupId: this.groupId,
            categoryId: s.courseId,
            prior: item.value
          }
        })
      },
      handleNode(item) {
        let s = this.subject
        let node = this.getStorage('_cache_subject_node')
        let section = {
          schoolId: node.schoolId,
          gradeType: node.gradeType,
          gradeIndex: node.gradeIndex,
          weekNum: item.value
        }
        if (node.id) {
          section.id = node.id
        }
        this.commitData({
          course: { id: s.courseId },
          sections: [section]
        })
      },
      handleSubmit() {
        let s = this.subject
        if (this.column === 'mutex') {
          let rs = this.subjects.filter(v => {
            return v.selected
          })
          if (Check.isRealArray(rs)) {
            rs = rs.map(v => {
              return {
                groupId: this.groupId,
                type: '1',
                categoryId: s.courseId,
                relationId: v.id
              }
            })
          }
          this.commitData({
            course: {
              id: s.courseId,
              groupId: this.groupId
            },
            relations: rs
          })
        } else if (this.column === 'limit') {
          this.commitData({
            course: {
              id: s.courseId,
              groupId: this.groupId
            },
            attr: {
              groupId: this.groupId,
              categoryId: s.courseId,
              openClassUpperLimit: this.limit
            }
          })
        } else if (this.column === 'score') {
          this.commitData({
            course: {
              id: s.courseId,
              groupId: this.groupId
            },
            attr: {
              groupId: this.groupId,
              categoryId: s.courseId,
              credit: this.score
            }
          })
        } else {
          if (Check.isNullString(this.name)) {
            this.$message({ message: '科目名称不能为空', type: 'warning' })
            return false
          }
          if (s && !s.editAble && s.courseId !== 0) {
            this.$message({ message: '公有科目不可编辑名称', type: 'warning' })
            return false
          }
          let course = {
            name: this.name,
            groupId: this.groupId
          }
          if (s.courseId !== 0) {
            course.id = s.courseId
          }
          this.commitData({ course: course })
        }
      },
      handleCategory() {
        this.setStorage('_cache_subject', this.subject)
        this.setStorage('_subject_category_cache', this.category)
        this.routePush({
          name: 'basiceSubjectSelectCategory',
          query: {
            sId: this.subject.courseId
          }
        })
      },
      handleRemove() {
        this.$confirm('确定删除该科目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commitData({
            course: {
              id: this.subject.courseId,
              groupId: this.groupId,
              status: 'd'
            }
          })
        })
      }
    }
  }
</script>
