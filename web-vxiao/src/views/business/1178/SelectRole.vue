<template>
  <page title="选择被评估人"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      })
    },
    methods: {
      ...mapActions(['setTeacherAppraisal']),
      fetchData() {
        const that = this

        let caches = that.appraisal.roles
        let rMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            rMap.set(v.id, v)
          })
        }

        let range = that.appraisal.range
        CategoryApi.getCategorysByType('132').then(res => {
          let roles = []
          if (range.value === '2') {
            roles = res.categorys.filter(v => {
              v.selected = Check.isObject(rMap.get(v.id))
              return v.remark === '2'
            })
          } else {
            roles = res.categorys.filter(v => {
              v.selected = Check.isObject(rMap.get(v.id))
              return v.remark === '1'
            })
          }
          that.list = roles
        })
      },
      handleSubmit() {
        let rs = this.list.filter(r => {
          return r.selected
        })
        this.setTeacherAppraisal({ roles: rs })
        this.routeBack()
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
