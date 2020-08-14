<template>
  <page title="应用设置">
    <div class="select-handler">
      <template>
        <div class="category-title text">默认接受人</div>
        <Relate :items="users"
                :plus="true"
                :reduce="true"
                @plus="handleAdd('executor')"
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
      ...mapActions(['setStorage']),
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
        // 判断一进来有没有数据，有的话就提交
        const that = this
        // 拿到缓存过来的数据
        // let approve = that.approve.users
        Api.tacitlyApprove(1224, this.groupId).then(res => {
          let persons = res.persons
          // 判断有没有这个数组
          if (Check.isArray(persons)) {
            this.id = persons[0].id
            let us = [
              {
                type: '1224',
                userId: persons[0].userId,
                name: persons[0].name,
                avatar: persons[0].avatar,
                groupId: that.groupId
              }
            ]
            let personsId = res.persons[0].id
            that.setStorage({ personsId })
            that.list.push(...us)
          } else {
            let personsId = ''
            that.setStorage({ personsId })
          }
        })
      },
      handleRemove(u) {
        // 删除的时候让传过去的id清空
        this.list.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.list.splice(i, 1)
            this.persons = {
              persons: [
                {
                  id: this.id,
                  status: 'd'
                }
              ]
            }
            Api.addOrremove(this.persons).then(res => {
              // 判断有没有这个数组
              let personsId = ''
              this.setStorage({ personsId })
              this.$message({ type: 'success', message: '删除成功!' })
            })
          }
        })
      },
      handleAdd(type, order) {
        // 添加
        let params = {
          apType: order,
          filters: this.list,
          level: this.levels.length
        }
        if (type === 'to') {
          params.approvers = this.list
        } else {
          params.executors = this.list
        }
        this.setStorage(params)
        this.routePush({ name: 'selectMember1224' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
