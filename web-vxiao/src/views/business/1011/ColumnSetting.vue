<template>
  <page title="栏目设置">
    <ProjectList :list="list"
                 :level="level"
                 v-on:add="handleAddColumn"
                 v-on:edit="handleColumn"></ProjectList>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        level: 2
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        active: 'getCreateObject'
      })
    },
    components: {
      ProjectList: resolve => require(['./ProjectList'], resolve)
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        Api.getColumns(that.currentGroup.groupId).then(res => {
          that.list = res.categorys
        })
      },
      handleAddColumn(parent) {
        let title = parent ? `新建二级项目` : `新建一级项目`
        this.setCreateObject({ parent: parent, title: title, column: null })
        this.routePush({ name: 'columnEdit1011' })
      },
      handleColumn(menu) {
        switch (menu.type) {
          case 'modify':
            this.handleModify(menu.parent, menu.project, menu.parent ? `编辑二级项目` : `编辑一级项目`)
            break
          case 'remove':
            this.handleRmove(menu.parent, menu.project, menu.index, menu.pIndex)
            break
          case 'admin':
            this.handleAdmin(menu.parent, menu.project)
            break
          case 'cover':
            this.handleCover(menu.parent, menu.project)
            break
          case 'link':
            this.handleLink(menu.parent, menu.project)
            break
        }
      },
      handleModify(parent, column, title) {
        this.setCreateObject({ parent: parent, title: title, column: column })
        this.routePush({ name: 'columnEdit1011' })
      },
      handleRmove(parent, column, index, pIndex) {
        const that = this

        let postData = null
        if (parent) {
          postData = {
            category: { id: parent.id, status: '1' },
            subCategory: [
              {
                id: column.id,
                groupId: that.currentGroup.groupId,
                parentId: parent.id,
                type: 'portal_menu',
                status: 'd'
              }
            ]
          }
        } else {
          postData = {
            category: {
              id: column.id,
              status: 'd'
            }
          }
        }

        Api.commitColumn([postData]).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          parent ? that.list[pIndex - 1].childs.splice(index - 1, 1) : that.list.splice(index - 1, 1)
        })
      },
      handleAdmin(parent, column) {
        let admins = column.managers || []
        this.setCreateObject({
          parent: parent,
          column: {
            ...column,
            managers: admins.map(v => {
              return { ...v, avatar: this.url(v.avatar) }
            })
          },
          admins: []
        })
        this.routePush({ name: 'columnAdmin1011' })
      },
      handleLink(parent, column) {
        this.setCreateObject({ parent: parent, column: { ...column, extension: column.extension || '' } })
        this.routePush({ name: 'columnLink1011' })
      },
      handleCover(parent, column) {
        this.setCreateObject({ parent: parent, column: column })
        this.routePush({ name: 'columnCover1011' })
      }
    }
  }
</script>
