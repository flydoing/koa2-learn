<template>
  <page title="选择班级"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>
    </item>
    <div class="category-title"></div>
    <item v-for="(cls,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(cls, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':cls.selected}"></i>
      </div>
      <div slot="main"
           v-html="cls.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        all: false
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

        let caches = that.appraisal.classes
        let cMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            cMap.set(v.groupId, v)
          })
        }

        GroupApi.getSchoolGroupsByType(that.currentGroup.parentId, '2').then(res => {
          that.list = res.groups.map(v => {
            if (cMap.get(v.groupId)) {
              v.selected = true
            } else {
              v.selected = false
            }
            return v
          })
          this.all = caches.length === that.list.length
        })
      },
      handleSubmit() {
        let cs = this.list.filter(v => {
          return v.selected
        })
        this.setTeacherAppraisal({ classes: cs })
        this.routeBack()
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        let cs = this.list.filter(v => {
          return v.selected
        })
        this.all = cs.length === this.list.length
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(v => {
          v.selected = this.all
          return v
        })
      }
    }
  }
</script>
