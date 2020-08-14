<template>
  <div>
    <Item @click="handleLogo"
          :hasClick="isSuperAdmin">
      <div>封面</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(currentGroup.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO' />
      </div>
    </Item>
    <Item :hasClick="false">
      <div>简称</div>
      <div slot="remark">{{group.name}}</div>
    </Item>
    <Item :hasClick="false">
      <div>全称</div>
      <div slot="remark">{{group.fullName}}</div>
    </Item>
    <Item :hasClick="isAdmin"
          @click="onSpace">
      <div>空间名称</div>
      <div slot="remark">{{space.obj}}</div>
    </Item>
    <Item :hasClick="false">
      <div>编号</div>
      <div slot="remark">{{group.groupId}}</div>
    </Item>
    <Item @click="handleXx">
      <div>形象</div>
    </Item>
    <Item @click="handleAddress">
      <div>详细地址</div>
      <div slot="remark">{{address.length}}个地址</div>
    </Item>
    <Item @click="handleXx"
          v-if="isSchool">
      <div>校区</div>
      <div slot="remark"
           class="ellipsis">{{group.campus | arrayToString}}</div>
    </Item>
    <Item @click="handleXx"
          v-if="isSchool">
      <div>类型</div>
      <div slot="remark">{{group.schoolTypeName}}</div>
    </Item>
    <Item v-if="isSchool"
          @click="handleOrg">
      <div>所属</div>
      <div slot="remark">{{org.name}}</div>
    </item>
    <Item @click="handleAdmins">
      <div>管理员</div>
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
  </div>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        group: {},
        org: {}
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      gid() {
        return this.routeQuery('groupId') || this.groupId
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
        let _space = {
          obj: '',
          extension: this.gid,
          metaType: 'm_group_space',
          status: '1'
        }
        if (Check.isRealArray(this.metaDatas)) {
          _space =
            this.metaDatas.filter(meta => {
              return meta.metaType === 'm_group_space' && this.gid === meta.extension
            })[0] || _space
        }
        return _space
      }
    },
    created() {
      this.initialize()
    },
    methods: {
      ...mapActions(['modifyGroup', 'insertRelations', 'modifyMetaData']),
      initialize() {
        let groupId = this.routeQuery('groupId') || this.groupId
        Api.getGroupAdmin(groupId).then(res => {
          this.insertRelations({
            groupId: this.groupId,
            relations: res.relations
          })
        })
        Api.getBelongOrg(this.schoolId).then(result => {
          this.org = result.school || {}
        })
      },
      handleLogo(file) {
        this.routePush({
          path: '/vx/group/about/banner'
        })
      },
      handleAdmins() {
        this.routePush({
          path: '/vx/group/about/admin',
          query: { groupId: this.routeQuery('groupId') || this.groupId }
        })
      },
      handleXx() {},
      handleAddress() {
        this.routePush({
          path: '/vx/group/about/address',
          query: {
            groupId: this.routeQuery('groupId') || this.groupId
          }
        })
      },
      handleOrg() {
        if (this.org.groupId) {
          this.routePush({
            path: '/vx/group/about/superior',
            query: { groupId: this.org.groupId }
          })
        } else {
          this.$prompt(' ', '所属', {
            inputPlaceholder: '输入所属教育局/教育集团编号',
            confirmButtonText: '查询',
            cancelButtonText: '取消',
            inputPattern: /^[0-9a-zA-Z]*$/,
            inputErrorMessage: '编号只能是数字、字母'
          }).then(({ value }) => {
            Api.getSchoolDetail(value).then(res => {
              if (res.school) {
                this.routePush({
                  path: '/vx/group/about/superior',
                  query: { groupId: res.school.groupId, schoolId: this.schoolId }
                })
              } else {
                this.$message({ type: 'warning', message: '输入编号有误，查询无结果' })
              }
            })
          })
        }
      },
      onSpace() {
        this.$prompt(' ', '空间名称', {
          inputPlaceholder: '输入',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '修改中...'
              this.modifyMetaData({
                ...this.space,
                obj: instance.inputValue
              }).then(res => {
                instance.confirmButtonLoading = false
                done()
              })
            } else {
              done()
            }
          }
        })
      }
    },
    watch: {
      currentGroup(v) {
        if (v.parentId) {
          Api.getSchoolDetail(v.groupId, v.parentId).then(res => {
            this.group = res.school
            if (Check.isRealArray(res.school.metaDatas)) {
              res.school.metaDatas.forEach(meta => {
                this.modifyMetaData(meta)
              })
            }
          })
        }
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
