<template>
  <page title="选择场所"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll()">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>

    </item>
    <div v-for="(item,i) in list"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item v-for="(place,j) in item.datas"
            :key="j"
            :hasArrow="false"
            @click="handleSelect(place, i, j)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':place.selected}"></i>
        </div>
        <div slot="main"
             v-html="place.name"></div>
      </item>
    </div>
  </page>
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
        list: [],
        all: false
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

        let caches = that.panomara.moment.places
        let pMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            pMap.set(v.placeId, v)
          })
        }

        Api.loadMomentPlaces(this.currentGroup.parentId).then(res => {
          for (let n in res.map) {
            let places = res.map[n].map(v => {
              return { ...v, selected: Check.isObject(pMap.get(v.placeId)) }
            })
            that.list.push({ name: n, datas: places })
          }
        })

        // Api.loadPlaces(this.currentGroup.parentId).then(res => {
        //   let typeMap = new Map()
        //   res.places.map(v => {
        //     let place = typeMap.get(v.type)
        //     if (place) {
        //       place.datas.push({ ...v, selected: !Check.isObject(pMap.get(v.placeId)) })
        //       typeMap.set(v.type, place)
        //     } else {
        //       typeMap.set(v.type, {
        //         type: v.type,
        //         name: v.typeName,
        //         datas: [{ ...v, selected: !Check.isObject(pMap.get(v.placeId)) }]
        //       })
        //     }
        //   })
        //   typeMap.forEach((v, k, i) => { that.list.push(v) })
        // })
      },
      handleSubmit() {
        let places = []
        this.list.map(v => {
          let ps = v.datas.filter(p => {
            return p.selected
          })
          places.push(...ps)
        })
        this.setPanomara({ moment: { ...this.panomara.moment, places: places } })
        this.routeBack()
      },
      handleSelect(item, i, j) {
        item.selected = !item.selected
        this.$set(this.list[i].datas, j, item)

        let len = 0
        let total = 0
        this.list.map(v => {
          let ps = v.datas.filter(p => {
            return p.selected
          })
          len += ps.length
          total += v.datas.length
        })
        len === total ? (this.all = true) : (this.all = false)
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(v => {
          v.datas = v.datas.map(p => {
            return { ...p, selected: this.all }
          })
          return v
        })
      }
    }
  }
</script>
