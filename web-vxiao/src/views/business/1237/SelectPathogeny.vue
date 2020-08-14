<template>
  <page title="选择病因"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in pathogenys"
          :key="i"
          :hasArrow="false"
          @click="handlePathogeny(item, i)"
          :class="{'full-input':item.status=='7'}">
      <template v-if="item.status != '7'">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </template>
      <template v-else>
        <input :placeholder="item.name"
               v-model="item.content" />
      </template>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        pathogenys: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      })
    },
    methods: {
      ...mapActions(['setAttendance']),
      fetchData() {
        const that = this
        let cMap = new Map()
        let caches = this.attendance.pathogenys
        if (Check.isRealArray(caches)) {
          let item = caches.filter(v => {
            return v.value === ''
          })[0]
          if (!item) {
            caches.map(v => {
              cMap.set(v.id, v)
            })
          }
        }

        Api.getSymptomsAndPathogenys().then(res => {
          if (res.data && res.data.centerSickReasons) {
            that.pathogenys = res.data.centerSickReasons.map(v => {
              let pgy = cMap.get(v.id)
              if (pgy) {
                return { ...v, ...pgy, selected: v.value !== '' && v.status !== '7' }
              }
              return { ...v, selected: false, content: '' }
            })
          }
        })
      },
      handlePathogeny(item, index) {
        if (!item.value) {
          this.setAttendance({ pathogenys: [item] })
          this.routeBack()
        }
        item.selected = !item.selected
      },
      handleSubmit() {
        const that = this
        let pgys = that.pathogenys.filter(v => {
          return v.selected || !Check.isNullString(v.content)
        })

        if (!Check.isRealArray(pgys)) {
          that.$message({ message: '请选择病因', type: 'warning' })
          return false
        }

        this.setAttendance({ pathogenys: pgys })
        that.routeBack()
      }
    }
  }
</script>
