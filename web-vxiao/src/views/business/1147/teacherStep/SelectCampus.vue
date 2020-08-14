<template>
  <page title="所在校区"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)"
          :label="item.name">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'

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
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let cMap = new Map()
        if (Check.isRealArray(this.obj.campuses)) {
          this.obj.campuses.map(v => {
            cMap.set(v.id, v)
          })
        }
        GroupApi.getSchoolCampus(this.currentGroup.parentId).then(res => {
          that.list = res.groups.map(v => {
            v.selected = Check.isObject(cMap.get(v.id))
            return v
          })
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)
      },
      handleSubmit() {
        let campuses = this.list.filter(v => {
          return v.selected
        })
        this.setCreateObject({ campuses: campuses })
        this.routeBack()
      }
    }
  }
</script>
