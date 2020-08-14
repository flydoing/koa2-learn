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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
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
        crm: 'getCrm'
      }),
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
      ...mapActions(['setCreateObject', 'deleteCrmProp']),
      fetchData() {
        if (this.crm.user) {
          this.deleteCrmProp('user')
          this.deleteCrmProp('type')
        }
        // 判断一进来有没有数据
        Api.tacitlyApprove(1104, this.groupId).then(res => {
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
          this.list = this.list.filter(v => {
            return v.id !== u.id
          })
        })
      },
      handleAdd(type) {
        // 添加  需要判断是审批人还是发货人
        this.setCreateObject({ user: type === '1' ? this.approves[0] : this.delievers[0], type: type })
        this.routePush({ name: 'selectMember1104' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
