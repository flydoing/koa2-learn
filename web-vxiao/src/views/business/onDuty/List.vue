<template>
  <page :title="title">
    <label slot="btn"
           @click="handleSet">设置</label>
    <div v-for="(item, i) in list"
         :key="i">
      <div class="category-title text"
           v-html="weekTxt(item)"></div>
      <Relate :items="users(item)"
              @plus="handleAdd(item)"
              @delete="handleRemove" />
    </div>

  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
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
        onDuty: 'getOnDuty'
      }),
      title() {
        return `值日生 - ${this.currentGroup.name}`
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setOnDuty', 'deleteOnDutyProp']),
      weekTxt(item) {
        if (item.timeType !== 'all') {
          return `${item.weekName}${item.timeType === 'am' ? '上午' : '下午'}（${item.date || ''}）`
        }
        return `${item.weekName}（${item.date || ''}）`
      },
      users(item) {
        if (Check.isRealArray(item.cells)) {
          return item.cells.map(v => {
            return {
              ...v,
              avatar: this.url(v.avatar),
              name: v.name || v.userName,
              weekId: item.id
            }
          })
        }
        return []
      },
      fetchData() {
        if (this.onDuty.week) {
          this.deleteOnDutyProp('week')
        }
        Api.getOnDutyUsers(this.groupId).then(res => {
          this.list = res.days || []
        })
      },
      handleAdd(item) {
        this.setOnDuty({ week: item })
        this.routePush({
          path: '/vx/group/business/onDuty/selectMember'
        })
      },
      handleRemove(user, index) {
        Api.modifyOnDutyUsers({
          days: [
            {
              id: user.weekId,
              cells: [
                {
                  id: user.id,
                  userId: user.userId,
                  status: 'd'
                }
              ]
            }
          ]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.list.forEach((v, i) => {
            if (v.id === user.weekId) {
              v.cells.forEach((k, j) => {
                if (user.userId === k.userId) {
                  this.list[i].cells.splice(j, 1)
                }
              })
            }
          })
        })
      },
      handleSet() {
        this.routePush({
          path: '/vx/group/business/onDuty/set'
        })
      }
    }
  }
</script>
