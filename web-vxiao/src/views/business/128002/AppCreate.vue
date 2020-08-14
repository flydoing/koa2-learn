<template>
  <Page title="导播台"
        :loading="loading"
        :showTips="showTips">
    <template v-if="isSchool">
      <div v-for="(v,k) in categorys"
           :key="k">
        <div class="category-title">{{k}}</div>
        <Item v-for="c in v"
              :label="c.name"
              :key="c.id"
              @click="onStart(c)" />
      </div>
    </template>
    <template v-else>
      <Item v-for="(p,i) in places"
            :key="i"
            :label="p.name"
            @click="onStart(p)" />
    </template>
    <template slot="tips">
      <img src="/static/ico/icon_commoneuse.png" />
      <span>{{currentGroup.name}} 未绑定场所，请联系管理员！</span>
    </template>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/views/business/1279/api'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        loading: true,
        places: [],
        categorys: {},
        isTip: false
      }
    },
    computed: {
      showTips() {
        if (this.isSchool) {
          return !Check.isRealArray(Object.keys(this.categorys))
        } else {
          return this.isTip
        }
      },
      isLookSelf() {
        let c = this.socketlisten('VRecordPlay') || { data: {} }
        return c.commandValue === '1000'
      },
      isClose() {
        let c = this.socketlisten('VRecordPlay')
        return !!c
      }
    },
    created() {
      if (this.isSchool) {
        Api.getVisionPlaces(this.schoolId).then(res => {
          this.loading = false
          res.visionPlaces.forEach(p => {
            if (!this.categorys[p.categoryName]) {
              this.$set(this.categorys, p.categoryName, [])
            }
            this.categorys[p.categoryName].push(p)
          })
        })
      } else {
        Api.getVisionPlaceByGroupId(this.groupId).then(res => {
          this.loading = false
          if (res && Check.isRealArray(res.visionPlaces)) {
            this.places = res.visionPlaces
            this.onStart(this.places[0])
          } else {
            this.isTip = true
          }
        })
      }
    },
    methods: {
      onStart(g) {
        this.socketSend({
          command: 'VRecordPlay',
          commandValue: '1000',
          data: {
            groupId: this.groupId,
            placeId: g.placeId,
            schoolId: g.schoolId
          }
        })
      }
    },
    watch: {
      isClose(v) {
        if (v && !this.isSchool) {
          this.routeBack()
        }
      },
      isLookSelf(v) {
        if (v) {
          this.routeBack()
        }
      }
    },
    destroyed() {
      // if (this.isLookSelf) {
      this.routePush({
        path: '/vx/user/vrecord'
      })
      // }
    }
  }
</script>
