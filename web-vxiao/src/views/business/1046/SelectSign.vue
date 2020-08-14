<template>
  <page title="签到/签退"
        @submit="handleSubmit"
        hasSubmit>
    <template v-if="signIns.length > 0">
      <div class="category-title text">签到</div>
      <ItemList v-for="(item, i) in signIns"
                :key="i"
                :hasArrow="false"
                :label="item.name"
                @click="handleSelect(item, i, 'in')">
        <div slot="before"
             v-if="item.isSelect === undefined">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <span slot="title">{{item.title}}</span>
        <span slot="main"
              v-html="dateTxt(item)"></span>
        <template slot="after"></template>
      </ItemList>
    </template>
    <template v-if="signOuts.length > 0">
      <div class="category-title text">签退</div>
      <ItemList v-for="(item, i) in signOuts"
                :key="i"
                :hasArrow="false"
                :label="item.name"
                @click="handleSelect(item, i, 'out')">
        <div slot="before"
             v-if="item.isSelect === undefined">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <span slot="title">{{item.title}}</span>
        <span slot="main"
              v-html="dateTxt(item)"></span>
        <template slot="after"></template>
      </ItemList>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        signIns: [],
        signOuts: [],
        params: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      dateTxt(item) {
        return DateUtils.format(item.modifyTime, 'yyyy-MM-dd')
      },
      fetchData() {
        this.params = this.crm.params
        let sMap = new Map()
        if (Check.isRealArray(this.crm.signs)) {
          this.crm.signs.map(v => {
            sMap.set(v.id, v)
          })
        }
        this.params.getDataList(datas => {
          datas.forEach(v => {
            if (v.type === '1') {
              this.signIns.push({ ...v, selected: Check.isObject(sMap.get(v.id)) })
            } else {
              this.signOuts.push({ ...v, selected: Check.isObject(sMap.get(v.id)) })
            }
          })
        })
        this.deleteCrmProp('params')
      },
      handleSelect(item, i, type) {
        if (item.isSelect) {
          return false
        }
        item.selected = !item.selected
        if (type === 'in') {
          this.signIns = this.signIns.map(v => {
            if (item.id === v.id) {
              return item
            }
            v.selected = false
            return v
          })
        } else {
          this.signOuts = this.signOuts.map(v => {
            if (item.id === v.id) {
              return item
            }
            v.selected = false
            return v
          })
        }
      },
      handleSubmit() {
        let signIn = this.signIns.filter(v => {
          return v.selected
        })
        let signOut = this.signIns.filter(v => {
          return v.selected
        })
        this.setCrm({ signs: [...signIn, ...signOut] })
        this.routeBack()
      }
    }
  }
</script>
