<template>
  <div class="pd">
    <Item @click="onLogo"
          :hasClick="isAdmin">
      <div>封面</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO' />
      </div>
    </Item>
    <Item @click="onName"
          :hasClick="isAdmin">
      <div>名称</div>
      <div slot="remark">{{group.name}}</div>
    </Item>
    <Item @click="showQrcode=true">
      <div>编号</div>
      <div slot="remark">
        <span>{{group.groupId}}</span>
        <i class="ico ico-qrcode" />
      </div>
    </Item>
    <Item @click="onOrg"
          :hasClick="isAdmin">
      <div>所属</div>
      <div slot="remark">{{group.schoolName}} {{group.campus}}</div>
    </Item>
    <Item v-if="showCatelog"
          @click="onCatalog">
      <div>目录</div>
      <div slot="remark"></div>
    </Item>
    <Item v-if="isClass"
          :hasClick="isAdmin">
      <div>入学</div>
      <div slot="remark">{{group.year}}</div>
    </Item>
    <Item @click="onAdmins">
      <div>管理员</div>
      <div slot="remark">
        <template v-for="(u,i) in admins">
          <img class="avatar smaller"
               v-if="i < 5"
               :key="i"
               v-lazy="{src:url(u.avatar,'thumb'),error:Image.ICO_USER}"
               alt='LOGO'
               style="margin:0px 3px;" />
        </template>
      </div>
    </Item>
    <Item @click="onPower"
          v-if="isAdmin">
      <div>群设置</div>
    </Item>
    <!-- 判断是否存在关系 -->
    <template v-if="isExistRelation">
      <div class="category-title flex-block"></div>
      <Item @click="onUserName">
        <div>我的昵称</div>
        <div slot="remark">{{currentUser.name}}</div>
      </Item>
      <Item @click="modifyShowMobile">
        <div>公开手机号码</div>
        <div slot="after">
          <i-switch :value.sync="mobileMeta.obj"
                    trueValue='true'></i-switch>
        </div>
      </Item>
      <Item>
        <div>群聊消息免打扰</div>
        <div slot="after">
          <i-switch :value.sync="disturbMeta.obj"
                    trueValue='true'></i-switch>
        </div>
      </Item>
      <div class="list-button"
           v-if="!isOrg && (isAdmin || currentGroup.isWithdraw === 1)">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="medium"
                   @click="onSignout">退出{{isClass ? '班级' : '群组'}}</el-button>
      </div>
    </template>
    <Overlay :show.sync="showQrcode"
             :width="300"
             background="transparent">
      <div class="qrcode-container">
        <div>{{school.name}}</div>
        <div>{{group.name}} 编号{{group.groupId}}</div>
        <img v-lazy="{src:url(group.qrcode)}" />
      </div>
    </Overlay>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        showQrcode: false,
        currentUser: {},
        mobileMeta: {}, // 是否公开手机号码
        disturbMeta: {}, // 群聊消息免打扰
        group: {},
        school: {}
      }
    },
    computed: {
      ...mapGetters({
        getSchool: 'getSchoolBySchoolId'
      }),
      showCatelog() {
        let viewType = this.currentGroup.viewType
        return viewType === '3' || viewType === '4'
      }
    },
    methods: {
      ...mapActions(['modifyGroup', 'modifyRelation']),
      initialize() {
        let groupId = this.routeQuery('groupId') || this.groupId
        if (groupId) {
          Api.getGroupDetail(groupId).then(res => {
            this.group = res.group || {}
            this.school = this.getSchool(this.group.parentId) || {}
          })
          this.initUser()
        }
      },
      initUser() {
        let groupId = this.routeQuery('groupId') || this.groupId
        Api.getGroupUser(groupId, this.userId).then(res => {
          if (Check.isRealArray(res.relations)) {
            this.currentUser = res.relations[0]
            let metaDatas = this.currentUser.metaDatas
            if (Check.isRealArray(metaDatas)) {
              metaDatas.some(meta => {
                if (meta.metaType === 'm_show_mobile') {
                  this.mobileMeta = meta
                } else if (meta.metaType === 'm_disturb_on') {
                  this.disturbMeta = meta
                }
              })
            }
          }
        })
      },
      onLogo() {
        this.routePush({
          path: '/vx/group/about/banner'
        })
      },
      onName() {
        this.$prompt(' ', '修改', {
          inputPlaceholder: this.group.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            Api.addGroup({
              groups: [
                {
                  groupId: this.group.groupId,
                  id: this.group.id,
                  name: value
                }
              ]
            }).then(res => {
              if (Check.isRealArray(res.groups)) {
                this.modifyGroup(res.groups[0])
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
              }
            })
          })
          .catch(() => {})
      },
      onUserName() {
        let that = this
        this.$prompt(' ', '修改昵称', {
          inputPlaceholder: that.currentUser.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            Api.addGroupRelation({
              relations: [
                {
                  id: that.currentUser.id,
                  groupId: that.group.groupId,
                  userId: that.userId,
                  name: value
                }
              ]
            }).then(res => {
              if (Check.isRealArray(res.relations)) {
                res.relations.forEach(r => {
                  that.modifyRelation(r)
                  that.currentUser = { ...that.currentUser, ...r }
                })
                that.$message({
                  type: 'success',
                  message: '修改成功'
                })
              }
            })
          })
          .catch(() => {})
      },
      onAdmins() {
        this.routePush({
          path: `/vx/group/about/admin`
        })
      },
      onOrg() {
        this.routePush({
          path: '/vx/group/about/Superior',
          query: { groupId: this.school.groupId }
        })
      },
      onCatalog() {
        this.routePush({
          path: '/vx/group/about/catalog',
          query: {
            groupId: this.groupId,
            isAdmin: this.isAdmin,
            id: this.currentGroup.id
          }
        })
      },
      onSignout() {
        let that = this
        if (this.currentGroup.isWithdraw !== '1') {
          this.$message({ type: 'warning', message: '本班级开启了退出限制，请联系班级管理员' })
          return
        }
        this.$confirm('确认退出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          Api.addGroupRelation({
            relations: [
              {
                groupId: that.group.groupId,
                id: that.currentUser.id,
                status: 'd'
              }
            ]
          }).then(res => {
            if (Check.isRealArray(res.relations)) {
              res.relations.forEach(r => {
                that.modifyRelation(r)
              })
              this.modifyGroup({ groupId: this.group.groupId, status: 'd' })
            }
          })
        })
      },
      onPower() {
        this.routePush({
          path: '/vx/group/about/power',
          query: {
            groupId: this.group.schoolGroupId
          }
        })
      },
      modifyShowMobile() {}
    },
    watch: {
      showMobile(v) {
        this.modifyShowMobile()
      },
      currentGroup() {
        this.initialize()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .qrcode-container {
    height: rem(300);
    color: #ffffff;
    @include bc;
    border-radius: rem(10);
    @include ct;
    @include fd;
    img {
      width: rem(200);
      height: rem(200);
      padding: rem(5);
      background: #fff;
      border-radius: rem(10);
    }
    div {
      &:nth-child(1) {
        margin-bottom: rem(5);
        font-size: rem(16);
      }
      &:nth-child(2) {
        margin-bottom: rem(15);
      }
    }
  }

  .vx-item-right {
    img {
      float: right;
    }
  }
</style>
