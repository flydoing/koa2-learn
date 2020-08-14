<template>
  <Page title="周期播放"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.name"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
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
      let rMap = new Map()
      if (this.obj.range) {
        this.obj.range.datas.map(v => {
          rMap.set(v.placeId, v)
        })
      }
      Api.getPlaces(this.schoolId).then(res => {
        if (res.places) {
          this.list = res.places.map(v => {
            return { ...v, selected: Check.isObject(rMap.get(v.id)) }
          })
        }
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        let ranges = this.list.filter(v => {
          return v.selected
        })
        if (Check.isRealArray(ranges)) {
          this.setCreateObject({
            range: {
              type: ranges.length === this.list.length ? '1' : '2',
              datas: ranges.map(v => {
                return { placeId: v.id }
              })
            }
          })
        } else {
          this.setCreateObject({ range: {} })
        }
        this.routeBack()
      }
    }
  }
</script>
