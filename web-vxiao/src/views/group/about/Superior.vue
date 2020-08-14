<template>
  <page :title="title">
    <Item label="封面"
          :hasClick="false">
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO' />
      </div>
    </Item>
    <Item label="简称"
          :hasClick="false"
          :remark="group.name">
    </Item>
    <Item :hasClick="false"
          label="全称"
          :remark="group.fullName">
    </Item>
    <Item :hasClick="false"
          label="空间名称"
          :remark="space.obj">
    </Item>
    <Item :hasClick="false"
          label="编号"
          :remark="group.groupId">
    </Item>
    <Item label="形象"
          :hasClick="false"></Item>
    <Item @click="handleAddress"
          label="详细地址">
      <div slot="remark">{{address.length}}个地址</div>
    </Item>
    <Item v-if="isSchool"
          :hasClick="false"
          label="校区"
          :remark="group.campus | arrayToString">
    </Item>
    <Item :hasClick="false"
          label="类型"
          :remark="group.schoolTypeName">
    </Item>
    <Item :hasClick="false"
          label="所属"
          :remark="org.name">
    </item>
    <Item :hasClick="false"
          label="管理员">
      <div slot="remark">
        <template v-for="(u,i) in admins">
          <img class="avatar smaller"
               :key="i"
               v-if="i<5"
               v-lazy="{src:url(u.avatar,'thumb'),error:Image.ICO_USER}"
               alt='LOGO'
               style="margin:0px 3px;" />
        </template>
      </div>
    </Item>
    <div class="button button-common"
         v-if="schoolId"
         @click="handleApply">申请认证</div>
  </page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    components: {},
    data() {
      return {
        group: {},
        org: {},
        admins: []
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      title() {
        return this.routeQuery('title') || '所属'
      },
      gid() {
        return this.routeQuery('groupId')
      },
      isSchool() {
        let orgType = this.group.schoolType || ''
        return orgType.length <= 5
      },
      schoolId() {
        return this.routeQuery('schoolId') || 0
      },
      address() {
        let address = []
        if (Check.isRealArray(this.metaDatas)) {
          address = this.metaDatas.filter(meta => {
            return meta.metaType === 'm_school_address' && this.gid === meta.extension
          })
        }
        return address
      },
      space() {
        let sp = {}
        if (Check.isRealArray(this.metaDatas)) {
          let _space = this.metaDatas.filter(meta => {
            return meta.metaType === 'm_group_space' && this.gid === meta.extension
          })[0]
          sp = _space || {}
        }
        return sp
      }
    },
    created() {
      Api.getSchoolDetail(this.gid).then(res => {
        if (res.school) {
          this.group = res.school
          if (Check.isRealArray(res.school.metaDatas)) {
            res.school.metaDatas.forEach(meta => {
              this.modifyMetaData(meta)
            })
          }
          Api.getBelongOrg(res.school.id).then(result => {
            this.org = result.school || {}
          })
        }
      })
      Api.getGroupAdmin(this.gid).then(res => {
        this.admins = res.relations || []
      })
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      handleAddress() {
        this.routePush({
          path: '/vx/group/about/address',
          query: {
            groupId: this.gid
          }
        })
      },
      handleApply() {
        Api.commitBelongApply({
          school: {
            id: this.schoolId,
            parentId: this.group.id
          }
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item-right {
    img {
      float: right;
    }
  }
</style>
