<template>
  <page title="负责人"
        hasSubmit
        @submit="handleSubmit">
    <div v-for="(item, i) in list"
         :key="i">
      <div class="category-title"
           v-if="i !== 0"></div>
      <item :label="item.name"
            :remark="userTxt(item.users)"
            @click="handlePerson(item)"></item>
      <el-popover placement="bottom-end"
                  width="400"
                  trigger="click"
                  v-model="item.showTime">
        <Scroller :height="300">
          <Item v-for="(t, i) in times"
                :key="i"
                @click="handleTime(item, t)"
                :label="t.name">
          </Item>
        </Scroller>
        <item slot="reference"
              label="工时"
              :remark="timeTxt(item.value)"></item>
      </el-popover>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        times: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      userTxt(users) {
        if (Check.isRealArray(users)) {
          let us = users.map(v => {
            return v.name
          })
          return us.join('、')
        }
        return '必填'
      },
      timeTxt(value) {
        if (!Check.isNullString(value)) {
          return `${value}天`
        }
        return '选填'
      },
      fetchData() {
        if (this.obj.jobs) {
          this.list = JSON.parse(JSON.stringify(this.obj.jobs))
          if (this.obj.job) {
            let job = this.obj.job
            this.list = this.list.map(v => {
              if (v.name === job.name) {
                return job
              }
              return v
            })
            this.modifyCreateObjectField('job')
          }
          this.modifyCreateObjectField('jobs')
        } else if (this.obj.persons) {
          let pMap = new Map()
          this.obj.persons.map(v => {
            let job = pMap.get(v.job)
            if (job) {
              job.users.push(v)
              pMap.set(v.job, job)
            } else {
              pMap.set(v.job, { name: v.job, users: v.userId ? [v] : [], value: v.value || '', showTime: false })
            }
          })
          this.list = [...pMap.values()]
        }
        let times = []
        for (let i = 0; i < 10; i++) {
          times.push({ name: `${i + 1 - 0.5}天`, value: i + 1 - 0.5 }, { name: `${i + 1}天`, value: i + 1 })
        }
        this.times = times
      },
      handlePerson(item) {
        this.setCreateObject({ jobs: this.list, job: item })
        this.routePush({
          path: '/vx/group/business/1203/selectMember'
        })
      },
      handleTime(item, data) {
        this.$set(item, 'value', data.value)
        this.$set(item, 'showTime', false)
      },
      handleSubmit() {
        let job = ''
        let flag = false
        let persons = []
        this.list.forEach(v => {
          if (!flag) {
            if (Check.isRealArray(v.users)) {
              v.users.forEach(u => {
                persons.push({ ...u, job: v.name, value: v.value })
              })
            } else {
              persons.push({ job: v.name })
              job = v.name
              flag = true
            }
          }
        })
        if (flag) {
          this.$message({ message: `${job}负责人不能为空`, type: 'warning' })
          return false
        }
        this.setCreateObject({ persons: persons })
        this.routeBack()
      }
    }
  }
</script>
