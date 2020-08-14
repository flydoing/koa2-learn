<template>
  <page title="职称">
    <item v-for="(item,i) in list"
          :hasClick="isEdit"
          :key="i"
          @click="handleItem(item,i)"
          :label="item.name"
          :remark="remarkTxt(item)">
    </item>
    <item v-if="isEdit"
          @click="handleAdd"
          :hasArrow="false"
          label="添加">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'

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
      }),
      isEdit() {
        return this.obj.isEdit === 1
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      remarkTxt(item, index) {
        return DateUtils.format(item.grantDate, 'yyyy-MM')
      },
      fetchData() {
        if (this.obj.call) {
          this.modifyCreateObjectField('call')
        }
        this.list = JSON.parse(JSON.stringify(this.obj.calls))
      },
      handleItem(item) {
        this.setCreateObject({ calls: this.list, call: item })
        this.routePush({ name: 'callEdit1179' })
      },
      handleAdd() {
        this.setCreateObject({ calls: this.list })
        this.routePush({ name: 'callEdit1179' })
      }
    }
  }
</script>
