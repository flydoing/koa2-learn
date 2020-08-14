<template>
  <page title="应用设置">
    <div class="select-handler">
      <template>
        <div class="category-title text">默认审批人</div>
        <Relate :items="approves"
                :plus="true"
                :reduce="true"
                @plus='handleAdd("1")'
                @delete="handleRemove" />
      </template>
      <template>
        <div class="category-title text">默认发货人</div>
        <Relate :items="delievers"
                :plus="true"
                :reduce="true"
                @plus='handleAdd("2")'
                @delete="handleRemove" />
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        list: [],
        levels: [],
        id: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      approves() {
        if (Check.isRealArray(this.list)) {
          return this.list.filter(v => {
            return v.level === '1'
          })
        }
        return []
      },
      delievers() {
        if (Check.isRealArray(this.list)) {
          return this.list.filter(v => {
            return v.level === '2'
          })
        }
        return []
      }
    },
    methods: {
      ...mapActions(['setBorrowMoney']),
      fetchData() {
        // 判断一进来有没有数据
        Api.tacitlyApprove(1105, this.groupId).then(res => {
          // 判断有没有这个数组
          if (Check.isArray(res.persons)) {
            this.list = res.persons.map(v => {
              // 这是头像的图片处理
              v.avatar = this.url(v.avatar)
              return v
            })
          }
        })
      },
      handleRemove(u) {
        // 要先获得是审批人还是发货人
        // 删除的时候让传过去的id清空
        Api.addOrremove({
          persons: [
            {
              id: u.id,
              status: 'd'
            }
          ]
        }).then(res => {
          this.$message({ type: 'success', message: '删除成功!' })
          let type = u.level === '1' ? '2' : '1'
          this.list = this.list.filter(v => {
            return v.level === type
          })
        })
      },
      handleAdd(type) {
        // 添加  需要判断是审批人还是发货人
        this.setBorrowMoney({ user: type === '1' ? this.approves[0] : this.delievers[0], type: type })
        this.routePush({ name: 'selectMember1105' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
