<!-- 选课科目 -->
<template>
  <div class="subject-step">
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.categoryName"
          @click="handleItem(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
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
      let data = form.subjectData || {}
      if (data.datas) {
        this.list = JSON.parse(JSON.stringify(data.datas))
      } else {
        this.loadSubjectData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      loadSubjectData() {
        let form = this.obj.form
        Api.getSubjects(this.schoolId).then(res => {
          if (res.table) {
            this.list = res.table.lines.map(v => {
              v.selected = false
              return v
            })
            this.setCreateObject({
              form: {
                ...form,
                subjectData: {
                  datas: this.list
                }
              }
            })
          }
        })
      },
      handleItem(item) {
        item.selected = !item.selected
        let form = this.obj.form
        this.setCreateObject({
          form: {
            ...form,
            subjectData: {
              datas: this.list
            }
          }
        })
      }
    }
  }
</script>
