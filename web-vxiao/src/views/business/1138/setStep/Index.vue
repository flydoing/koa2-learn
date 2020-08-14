<!-- 选课设置 -->
<template>
  <div class="set-step">
    <item :hasClick="false"
          label="选课名称">
      <input slot="remark"
             type="text"
             v-model="form.name"
             placeholder="输入（如：2017年高三选课）">
    </item>
    <item :hasClick="false"
          label="开始时间">
      <div slot="after">
        <el-date-picker v-model="form.startTime"
                        prefix-icon="x"
                        :clearable="false"
                        type="datetime"
                        placeholder="必填"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"></el-date-picker>
      </div>
    </item>
    <item :hasClick="false"
          label="结束时间">
      <div slot="after">
        <el-date-picker v-model="form.endTime"
                        prefix-icon="x"
                        :clearable="false"
                        type="datetime"
                        placeholder="必填"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"></el-date-picker>
      </div>
    </item>
    <item :hasClick="false"
          label="科目要求">
      <input slot="remark"
             v-model="form.count"
             placeholder="输入数量">
    </item>
    <ItemList @click="handleExam">
      <span slot="title">关联成绩分析</span>
      <span slot="main">学生可见不同选课组合中的名次</span>
      <span slot="remark"
            v-html="examTxt"></span>
    </ItemList>
    <TextInput placeholder="选课说明（选填）"
               :max="200"
               v-model="form.content"></TextInput>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    props: {
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        form: {
          name: '',
          startTime: '',
          endTime: '',
          count: '',
          exam: null,
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      examTxt() {
        let exam = this.form.exam || {}
        return exam.name || ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let form = this.obj.form || {}
        let data = form.setData || {}
        if (data.setItems) {
          this.form = JSON.parse(JSON.stringify(data.setItems))
          if (this.obj.exam) {
            this.form.exam = this.obj.exam
            this.modifyCreateObjectField('exam')
          }
        } else {
          this.saveForm()
        }
      },
      handleExam() {
        this.routePush({ path: '/vx/group/business/1138/setStep/selectExam' })
      },
      saveForm() {
        let form = this.obj.form
        this.setCreateObject({
          form: {
            ...form,
            setData: {
              setItems: this.form
            }
          }
        })
      }
    },
    watch: {
      'form.name'(val) {
        this.saveForm()
      },
      'form.startTime'(val) {
        this.saveForm()
      },
      'form.endTime'(val) {
        this.saveForm()
      },
      'form.count'(val) {
        this.saveForm()
      },
      'form.content'(val) {
        this.saveForm()
      },
      'form.exam'(val) {
        this.saveForm()
      },
      timeStamp(val) {
        this.fetchData()
      }
    }
  }
</script>
