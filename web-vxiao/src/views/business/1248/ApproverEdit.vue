<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div v-for="(item, i) in levels"
         :key="i">
      <div class="category-title text">第{{item.value}}审批人</div>
      <Relate :items="getApprovers(item.value)"
              :plus="true"
              :reduce="true"
              @plus="handleAdd(item.value)"
              @delete="handleRemove" />
    </div>
    <div class="button button-common"
         @click="handleAddItem">添加审批层级</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
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
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        doc: 'getDocument'
      }),
      title() {
        return this.doc.category ? this.doc.category.name : ''
      },
      aps() {
        let users = []
        if (Check.isRealArray(this.list)) {
          users = this.list.map(v => {
            return { ...v, avatar: this.url(v.avatar) }
          })
        }
        return users
      }
    },
    methods: {
      ...mapActions(['setDocument', 'deleteDocumentProp']),
      // 比较字段数值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      getApprovers(type) {
        return this.aps.filter(v => {
          return v.approveOrder === type
        })
      },
      fectchData() {
        let dts = []
        if (this.doc.approvers) {
          dts = JSON.parse(JSON.stringify(this.doc.approvers))
          this.deleteDocumentProp('approvers')
        } else if (this.doc.category && this.doc.category.users) {
          dts = JSON.parse(JSON.stringify(this.doc.category.users))
        }

        let level = 3
        if (Check.isRealArray(dts)) {
          dts.sort(this.compare('approveOrder')).reverse()
          level = dts[0].approveOrder
          this.list = dts
        }
        if (this.doc.level) {
          level = this.doc.level
          this.deleteDocumentProp('level')
        }
        for (let i = 0; i < (level < 3 ? 3 : level); i++) {
          this.levels.push({ value: i + 1 })
        }

        if (Check.isRealArray(this.doc.users)) {
          let us = this.doc.users.map(v => {
            return {
              categoryId: this.doc.category.id,
              userId: v.userId,
              name: v.name,
              avatar: v.avatar,
              mobile: v.mobile,
              approveOrder: this.doc.apType,
              groupId: this.currentGroup.groupId
            }
          })
          this.list.push(...us)
          this.deleteDocumentProp('users')
        }
      },
      handleRemove(u) {
        this.list.forEach((v, i) => {
          if (u.userId === v.userId) {
            this.list.splice(i, 1)
          }
        })
      },
      handleAdd(type) {
        this.setDocument({ apType: type, approvers: this.list, filters: this.list, level: this.levels.length })
        this.routePush({ name: 'selectMember1248' })
      },
      handleAddItem() {
        this.levels.push({ value: this.levels.length + 1 })
      },
      handleSubmit(item) {
        if (this.doc.isCache) {
          this.setDocument({ users: this.list })
          this.routeBack()
        } else {
          let users = this.list.map(v => {
            return {
              categoryId: v.categoryId,
              userId: v.userId,
              approveOrder: v.approveOrder,
              groupId: v.groupId
            }
          })
          Api.addCategoryApprovers(users).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    border-top: $border;
  }
</style>
