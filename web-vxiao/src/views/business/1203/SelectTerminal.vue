<template>
  <page title="终端"
        hasSubmit
        @submit="handleSubmit">
    <item v-for="(item, j) in list"
          :key="j"
          :hasArrow="false"
          :label="item.name"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
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
      let tMap = new Map()
      if (this.obj.terminals) {
        this.obj.terminals.forEach(v => {
          tMap.set(v.id, v)
        })
      }
      CategoryApi.getCategorysByType('163').then(res => {
        if (res.categorys) {
          this.list = res.categorys.map(v => {
            v.selected = Check.isObject(tMap.get(v.id))
            return v
          })
        }
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        let terminals = this.list.filter(v => {
          return v.selected
        })
        this.setCreateObject({ terminals: terminals })
        this.routeBack()
      }
    }
  }
</script>
