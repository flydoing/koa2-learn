<template>
  <page title="选择模板">
    <div class="template-list">
      <div class="tl-item" v-for="(item, i) in templates" :key="i" :item="item">
        <template v-if="isAuto">
          <Commend :commendation="item" @click="handleSelect(item, i)">
            <template slot="content">
              <span>&#12288;&#12288;郑大大，很厉害哦</span>
            </template>
            <template slot="tag">
              <span>三年一班</span>
              <br>
              <span>2018-06-09</span>
            </template>
          </Commend>
        </template>
        <template v-else>
          <Commend :commendation="item" @click="handleSelect(item, i)"></Commend>
        </template>
      </div>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'
import Api from './api'

export default {
  mixins: [R],
  data() {
    return {
      isAuto: this.routeQuery('isAuto'),
      templates: []
    }
  },
  components: {
    Commend: resolve => require(['./Commend'], resolve)
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      commend: 'getCommend'
    })
  },
  methods: {
    ...mapActions(['setCommend']),
    tempLogo(value) {
      return this.url(value)
    },
    handleSelect(item, index) {
      this.setCommend({ cmdn: { ...this.commend.cmdn, template: item } })
      this.routeBack()
    },
    fetchData() {
      const that = this
      let temp = that.commend.cmdn.template
      let view = that.commend.view
      Api.loadTemplates(that.currentGroup.groupId).then(res => {
        that.templates = res.categorys.map(t => {
          if (temp && temp.id === t.id) {
            t.active = true
          } else {
            t.active = false
          }
          if (!that.isAuto && view) {
            return { ...t, ...view }
          }
          return t
        })
      })
    }
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.template-list {
  .tl-item {
    display: block;
    margin: 0 auto;
    margin-top: rem(10)!important;
    width: rem(412);
    height: rem(232);
  }
}

</style>
