<template>
  <page title="病因设置"
        @submit="handleSubmit"
        :hasSubmit="template.remark!='0'">
    <item @click="handleTemplate">
      <div slot="main">病因模板</div>
      <div slot="remark"
           class="ellipsis"
           v-html="template.name"></div>
    </item>
    <div class="category-title text">症状</div>
    <item v-for="(item,i) in template.childs"
          :key="i"
          :item="item"
          :hasClick="false">
      <template v-if="template.remark!='0' && item.status!='2'">
        <input placeholder="请输入内容"
               v-model="item.name" />
        <i slot="after"
           class='ico ico-delete'
           @click="handleRemoveSymptom(item, i)"></i>
      </template>
      <template v-else>
        <div slot="main"
             v-html="item.name"></div>
      </template>
    </item>
    <item @click="handleAddSymptom"
          :hasArrow="false"
          v-if="template.remark!='0'">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增</div>
    </item>
    <div class="category-title text">诊断（病因）</div>
    <item v-for="(item,i) in template.datas"
          :key="i"
          :item="item"
          :hasClick="false">
      <template v-if="template.remark!='0' && item.status!='2'">
        <input placeholder="请输入内容"
               v-model="item.name" />
        <i slot="after"
           class='ico ico-delete'
           @click="handleRemovePathogeny(item, i)"></i>
      </template>
      <template v-else>
        <div v-html="item.name"></div>

      </template>
    </item>
    <item @click="handleAddPathogeny"
          :hasArrow="false"
          v-if="template.remark!='0'">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {},
    components: {},
    data() {
      return {
        template: {
          name: '',
          datas: [],
          childs: []
        },
        removeList: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    methods: {
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this
        let rMap = new Map()
        if (Check.isRealArray(that.attendance.removeList)) {
          that.removeList = that.attendance.removeList
          that.removeList.map(v => {
            rMap.set(v.id, v)
          })
        }
        Api.getTemplateData(that.currentGroup.groupId).then(res => {
          that.template = res.category
          if (that.template.remark !== '0') {
            that.template.childs = that.template.childs.filter(v => {
              return v.status !== '5' && v.status !== '7' && !rMap.get(v.id)
            })
            that.template.datas = that.template.datas.filter(v => {
              return v.status !== '5' && v.status !== '7' && !rMap.get(v.id)
            })
          }
        })
      },
      handleTemplate() {
        this.setAttendance({ template: this.template, removeList: this.removeList })
        this.routePush({ name: 'selectTemplate1197' })
      },
      handleAddSymptom() {
        this.template.childs.push({
          name: '',
          parentId: this.template.id,
          type: '17',
          status: '1',
          remark: '1',
          flag: '0',
          value: ''
        })
      },
      handleRemoveSymptom(item, index) {
        item.id && this.removeList.push(item)
        this.template.childs.splice(index, 1)
      },
      handleAddPathogeny() {
        this.template.datas.push({
          name: '',
          parentId: this.template.id,
          type: '27',
          status: '1',
          remark: '1',
          flag: '0',
          value: ''
        })
      },
      handleRemovePathogeny(item, index) {
        item.id && this.removeList.push(item)
        this.template.datas.splice(index, 1)
      },
      handleSubmit() {
        const that = this
        let temp = that.template
        let items = []
        let flag = true

        temp.childs.forEach((v, i) => {
          if (Check.isNullString(v.name)) {
            flag = false
            return false
          }
          items.push({ ...v, value: v.value || '' })
        })

        temp.datas.forEach((v, i) => {
          if (Check.isNullString(v.name)) {
            flag = false
            return false
          }
          items.push({ ...v, value: v.value || '' })
        })

        if (!Check.isRealArray(items)) {
          that.$message({ message: '模板内容不能为空', type: 'warning' })
          return false
        }

        if (!flag) {
          that.$message({ message: '存在空项目', type: 'warning' })
          return false
        }

        if (Check.isRealArray(that.removeList)) {
          that.removeList.map(v => {
            items.push({ ...v, value: v.value || '', status: 'd' })
          })
        }

        CategoryApi.addCategory(items).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
