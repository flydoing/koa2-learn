<template>
  <Page :title="title"
        hasSubmit
        @submit="handleSumbit">
    <draggable v-model="list">
      <item v-for="(item, i) in list"
            :key="i"
            :hasArrow="false"
            :label="item.name"
            @click="handleGroup(item)">
        <i slot="remark"
           class="ico ico-vs-sort"></i>
      </item>
    </draggable>
  </Page>
</template>
<script>
  import Group from '@/constant/group'
  import Draggable from 'vuedraggable'
  import Check from '@/utils/check'
  import Api from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Draggable
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        groups: 'getGroupMenus'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    created() {
      let schoolId = this.routeQuery('sid')
      if (Check.isRealArray(this.groups)) {
        let list = this.groups.filter(v => {
          return v.type === Group.ORDINARY && v.parentId === schoolId
        })
        this.list = list.sort((a, b) => {
          return a.sort - b.sort
        })
      }
    },
    methods: {
      ...mapActions(['getUserBase']),
      handleSumbit() {
        let groups = []
        this.list.forEach(v => {
          groups.push({ groupId: v.groupId })
        })
        Api.modifyGroupSort({ groups: groups }).then(res => {
          this.getUserBase()
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
