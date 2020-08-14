<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          class="full-input">
      <input placeholder="方案名称"
             v-model="aplCase.title" />
    </item>
    <div class="category-title"></div>
    <div v-for="(item,i) in aplCase.questions"
         :key="i">
      <Question :num="i+1"
                :question="item"
                @click="handleQuestion"></Question>
      <div class="category-title"></div>
    </div>
    <item v-for="(item,i) in types"
          :key="i"
          :hasArrow="false"
          @click="handleAdd(item)">
      <div slot="before">
        <div class='ico ico-plus'></div>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
    <div v-if="aplCase.id"
         class="button button-common"
         @click="handleRemove">删除方案</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        aplCase: {
          title: '',
          questions: []
        },
        types: []
      }
    },
    components: {
      Question: resolve => require(['./Question'], resolve)
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      }),
      title() {
        return this.aplCase.id ? `编辑评估方案 ` : '新建评估方案'
      }
    },
    methods: {
      ...mapActions(['setTeacherAppraisal']),
      fetchData() {
        const that = this
        if (that.appraisal.aplCase) {
          that.aplCase = JSON.parse(JSON.stringify(that.appraisal.aplCase))
        }

        CategoryApi.getCategorysByType('131').then(res => {
          that.types = res.categorys
        })
      },
      handleAdd(item) {
        this.setTeacherAppraisal({ aplCase: this.aplCase, question: null, type: item, qtIndex: this.aplCase.questions.length })
        this.routePush({ name: 'questionEdit1178' })
      },
      handleQuestion(qt, index) {
        this.setTeacherAppraisal({ question: qt, qtIndex: index - 1 })
        this.routePush({ name: 'questionEdit1178' })
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该题目', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            Api.removeCase(that.aplCase.id).then(res => {
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack()
            })
          })
      },
      handleSubmit() {
        const that = this
        let aplCase = that.aplCase
        if (Check.isNullString(aplCase.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(aplCase.questions)) {
          that.$message({ message: '至少添加一道评估题', type: 'warning' })
          return false
        }

        let postData = {
          title: aplCase.title,
          groupId: that.currentGroup.groupId,
          questions: aplCase.questions
        }
        aplCase.id && (postData.id = aplCase.id)

        Api.commitCase(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
