<template>
  <page title="选择群组"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <div v-for="(item, i) in groups"
         :key="i">
      <div v-if="i===1"
           class="category-title text"></div>
      <item @click="handleGroup(item)">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="remarkTxt(item)"></div>
      </item>
    </div>

  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        groups: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      remarkTxt(group) {
        if (Check.isRealArray(group.users)) {
          return `${group.users.length}人`
        }
        return ''
      },
      fetchData() {
        let group = this.arrange.group
        if (this.arrange.groups) {
          this.groups = JSON.parse(JSON.stringify(this.arrange.groups))
          if (group) {
            this.groups = this.groups.map(v => {
              if (v.groupId === group.groupId) {
                return group
              }
              return v
            })
            this.deleteArrangeExamProp('group')
          }
          this.deleteArrangeExamProp('groups')
        } else {
          Api.getInvigilateGroups(this.groupId).then(res => {
            let tGroup = null
            let gs = []
            res.datas.map(v => {
              if (v.parentId) {
                gs.push(v)
              } else {
                tGroup = v
              }
            })
            this.groups.push(tGroup, ...gs)
          })
        }
      },
      handleSubmit() {
        const that = this

        let members = []
        that.groups.map(v => {
          if (Check.isRealArray(v.users)) {
            members.push(...v.users)
          }
        })

        if (!Check.isRealArray(members)) {
          that.$message({ message: '请选择监考成员', type: 'warning' })
          return false
        }

        that.setArrangeExam({ members: [...that.arrange.members, ...members] })
        that.routeBack()
      },
      handleGroup(item) {
        this.setArrangeExam({
          groups: this.groups,
          group: item,
          users: item.users
        })
        let query = { groupId: item.groupId }
        if (item.parentId) {
          query.userType = '2'
        }
        this.routePush({
          name: 'selectMember1164',
          query: query
        })
      }
    }
  }
</script>
