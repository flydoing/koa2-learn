<template>
  <page title="调查范围"
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
    <item v-for="(item, i) in groups"
          :key="i"
          @click="handleSelect(item)"
          :hasArrow="false">
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
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        groups: [],
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        questionaire: 'getQuestionaire'
      })
    },
    methods: {
      ...mapActions(['setQuestionaire']),
      fetchData() {
        const that = this
        let caches = that.questionaire.ranges
        GroupApi.getSchoolAllGroups(that.currentGroup.parentId).then(res => {
          let gMap = new Map()
          let groups = [...res.groups, ...res.classes]
          if (Check.isRealArray(caches)) {
            caches.map(v => {
              gMap.set(v.groupId, v)
            })
            that.groups = groups.map(v => {
              v.selected = Check.isObject(gMap.get(v.groupId))
              return v
            })
          } else {
            that.groups = groups.map(v => {
              v.selected = true
              return v
            })
            that.all = true
          }
        })
      },
      handleSubmit() {
        const that = this
        let gs = that.groups.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(gs)) {
          that.$message({ message: '请选择调查范围', type: 'warning' })
          return false
        }

        if (that.all) {
          that.setQuestionaire({ ranges: [] })
        } else {
          that.setQuestionaire({ ranges: gs })
        }
        that.routeBack()
      },
      handleAll() {
        this.all = !this.all
        this.groups.map(v => {
          v.selected = this.all
          return v
        })
      },
      handleSelect(item) {
        item.selected = !item.selected

        let gs = this.groups.filter(v => {
          return v.selected
        })
        this.all = gs.length === this.groups.length
      }
    }
  }
</script>
