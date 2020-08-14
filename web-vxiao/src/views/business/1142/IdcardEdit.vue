<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false">
    <item :hasClick="false">
      <input placeholder="身份证后六位"
             v-model="idcard" />
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        idcard: ''
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        visitor: 'getVisitor'
      }),
      title() {
        return this.visitor.parent ? this.visitor.parent.name : ''
      }
    },
    methods: {
      ...mapActions(['setVisitor']),
      fectchData() {
        const that = this
        if (this.visitor.parent) {
          that.idcard = that.visitor.parent.simpleIdcard || ''
        }
      },
      handleSubmit() {
        const that = this
        let parent = that.visitor.parent
        let group = that.visitor.group
        if (Check.isNullString(that.idcard)) {
          that.$message({ message: '请输入身份证后六位', type: 'warning' })
          return false
        }

        GroupApi.addGroupRelation({
          relations: [
            {
              id: parent.id,
              userId: parent.userId,
              groupId: group.groupId,
              simpleIdcard: that.idcard
            }
          ]
        }).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
