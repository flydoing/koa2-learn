<template>
  <Page title="选择场所">
    <template v-for="(item,i) in list">
      <div :key="i"
           v-if="item.datas.length > 0">
        <div class="category-title text"
             v-html="item.name"></div>
        <item v-for="(place,j) in item.datas"
              :key="j"
              :hasArrow="false"
              @click="handleSelect(place)">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':place.selected}"></i>
          </div>
          <div slot="main"
               v-html="place.name"></div>
        </item>
      </div>
    </template>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
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
        panomara: 'getPanomara'
      })
    },
    methods: {
      ...mapActions(['setPanomara']),
      fetchData() {
        const that = this

        let pMap = new Map()
        let cache = that.panomara.equipment.place
        let es = that.panomara.equipments
        if (Check.isRealArray(es)) {
          es.map(v => {
            if ((cache && cache.id !== v.placeId) || !cache) {
              pMap.set(v.placeId, v)
            }
          })
        }

        Api.loadPlaces(this.currentGroup.parentId).then(res => {
          let typeMap = new Map()
          res.places.map(v => {
            if (!Check.isObject(pMap.get(v.id))) {
              cache && cache.id === v.id ? (v.selected = true) : (v.selected = false)

              let place = typeMap.get(v.type)
              if (place) {
                place.datas.push(v)
                typeMap.set(v.type, place)
              } else {
                typeMap.set(v.type, { type: v.type, name: v.typeName, datas: [v] })
              }
            }
          })
          typeMap.forEach((v, k, i) => {
            that.list.push(v)
          })
        })
      },
      handleSelect(item) {
        this.setPanomara({ equipment: { ...this.panomara.equipment, place: item } })
        this.routeBack()
      }
    }
  }
</script>
