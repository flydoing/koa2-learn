<template>
  <page title="审批人"
        @submit="handleSubmit"
        hasSubmit>
    <div class="select-handler">
      <div v-for="(item, i) in levels"
           :key="i">
        <div class="category-title text">第{{item.value}}审批人</div>
        <Relate :items="getApprovers(item.value)"
                :plus="true"
                :reduce="true"
                @plus="handleAdd(item.value)"
                @delete="handleRemove" />
      </div>
      <item @click="handleAddItem"
            :hasArrow="false"
            label="添加审批层级">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        list: [],
        levels: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      users() {
        let us = []
        if (Check.isRealArray(this.list)) {
          us = this.list.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return us
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      // 比较字段数值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      getApprovers(type) {
        return this.users.filter(v => {
          return v.approveOrder === type
        })
      },
      fetchData() {
        let dts = []
        let level = 3
        if (Check.isRealArray(this.crm.approvers)) {
          dts = JSON.parse(JSON.stringify(this.crm.approvers))
          dts.sort(this.compare('approveOrder')).reverse()
          level = dts[0].approveOrder
          this.list = dts
        }

        if (this.crm.level) {
          level = this.crm.level
          this.deleteCrmProp('level')
        }
        for (let i = 0; i < (level < 3 ? 3 : level); i++) {
          this.levels.push({ value: i + 1 })
        }

        if (Check.isRealArray(this.crm.users)) {
          let us = this.crm.users.map(v => {
            return {
              type: 'to',
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: this.crm.apType || '1',
              groupId: this.groupId
            }
          })
          this.list.push(...us)
          this.deleteCrmProp('users')
          this.deleteCrmProp('apType')
        }
      },
      handleRemove(u) {
        this.list.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.list.splice(i, 1)
          }
        })
      },
      handleAdd(order) {
        this.setCrm({
          apType: order,
          approvers: this.list,
          level: this.levels.length
        })
        this.routePush({ name: 'selectMember1287' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleSubmit() {
        if (!Check.isRealArray(this.list)) {
          this.$message({ message: `请选择审批人`, type: 'warning' })
          return false
        }
        this.setCrm({ approvers: this.list })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
