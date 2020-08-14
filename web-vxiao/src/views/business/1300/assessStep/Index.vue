<!-- 评估题目 -->
<template>
  <div class="assess-step">
    <item v-for="(qst, i) in filterQuestions(list)"
          :key="i"
          @click="handleQst(qst)"
          :label="(i + 1) + '、' + qst.title"
          :remark="remarkTxt(qst)">
    </item>
    <item label="新增"
          :hasArrow="false"
          @click="handleAddQst">
      <div slot="before"><i class="ico ico-plus"></i></div>
    </item>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    props: {
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      filterQuestions(datas) {
        return datas.filter(v => {
          return v.status !== 'd'
        })
      },
      remarkTxt(qst) {
        let tp = qst.type || {}
        return tp.name || ''
      },
      fetchData() {
        let form = this.obj.form || {}
        let aData = form.assessData || {}
        if (aData.datas) {
          this.list = JSON.parse(JSON.stringify(aData.datas))
          let qst = this.obj.question || {}
          if (qst.status === 'd' && !Check.isNumber(qst.id)) {
            this.list = this.list.filter(v => {
              return v.id !== qst.id
            })
          } else if (qst.id) {
            this.list = this.list.map(v => {
              if (v.id === qst.id) {
                return qst
              }
              return v
            })
          } else if (!Check.isNullObject(qst)) {
            this.list.push({ ...qst, id: `new${Math.random(1, 999)}` })
          }
          this.saveData()
          this.modifyCreateObjectField('question')
        } else {
          this.saveData()
        }
      },
      saveData() {
        let form = this.obj.form || {}
        let aData = form.assessData || {}
        this.setCreateObject({
          form: {
            ...form,
            assessData: {
              ...aData,
              datas: this.list
            }
          }
        })
      },
      handleQst(qst) {
        this.setCreateObject({ question: qst })
        this.routePush({ path: '/vx/group/business/1300/questionEdit' })
      },
      handleAddQst() {
        this.routePush({ path: '/vx/group/business/1300/questionEdit' })
      }
    },
    watch: {
      timeStamp(val) {
        this.fetchData()
      }
    }
  }
</script>
