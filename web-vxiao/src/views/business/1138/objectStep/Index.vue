<!-- 选课对象 -->
<template>
  <div class="object-step">
    <div v-for="(item, i) in list"
         :key="i">
      <template v-if="item.groups">
        <div class="category-title text"
             v-html="item.name"></div>
        <item v-for="(grade, j) in item.groups"
              :key="j"
              :hasArrow="false"
              :label="grade.name"
              @click="handleGrade(item, grade)">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':grade.selected}"></i>
          </div>
        </item>
      </template>
    </div>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
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
      let form = this.obj.form || {}
      let data = form.objectData || {}
      if (data.datas) {
        this.list = JSON.parse(JSON.stringify(data.datas))
      } else {
        this.loadGradeData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      loadGradeData() {
        let form = this.obj.form || {}
        Api.getGrades(this.schoolId).then(res => {
          if (res.groups) {
            this.list = res.groups.map(v => {
              if (v.groups) {
                v.groups = v.groups.map(g => {
                  g.selected = false
                  return g
                })
              }
              return v
            })
            this.setCreateObject({
              form: {
                ...form,
                objectData: {
                  datas: this.list
                }
              }
            })
          }
        })
      },
      handleGrade(item, grade) {
        let data = null
        this.list = this.list.map(v => {
          v.groups = v.groups.map(g => {
            if (g.groupId === grade.groupId) {
              g.selected = !grade.selected
            } else {
              g.selected = false
            }
            if (g.selected) {
              data = g
            }
            return g
          })
          return v
        })

        let form = this.obj.form
        this.setCreateObject({
          form: {
            ...form,
            objectData: {
              datas: this.list,
              grade: data
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .subject-step {
    .el-table th > .cell,
    .el-table .cell {
      text-align: center;
    }

    .el-table .cell > div {
      @include fh;
      cursor: pointer;
    }
  }
</style>
