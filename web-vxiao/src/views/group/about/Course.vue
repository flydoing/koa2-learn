<template>
  <Page :title="group.name">
    <Item @click="handleLogo">
      <div>封面</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO' />
      </div>
    </Item>
    <Item @click="handleName"
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
    <Item @click="handleOrg">
      <div>所属</div>
      <div slot="remark">{{group.schoolName}} {{group.campus}}</div>
    </item>
    <Item :hasClick="false">
      <div>标签</div>
      <div slot="remark">{{groupMeta.tagName}}</div>
    </Item>
    <Item v-if="showCatelog"
          @click="onCatalog">
      <div>目录</div>
      <div slot="remark"></div>
    </Item>
    <!-- 类别 -->
    <template v-if="isAdmin">
      <el-dropdown class="block-element"
                   trigger="click"
                   placement="bottom-end"
                   @command="onCourseType">
        <Item>
          <div>类别</div>
          <div slot="remark">{{groupMeta.courseType==='2'?'校本课程':'国家课程'}}</div>
        </Item>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item command="1">国家课程</el-dropdown-item>
          <el-dropdown-item command="2">校本课程</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <Item :hasClick="false">
        <div>类别</div>
        <div slot="remark">{{groupMeta.courseType==='2'?'校本课程':'国家课程'}}</div>
      </Item>
    </template>
    <!-- 开放范围 -->
    <template v-if="isAdmin">
      <el-dropdown class="block-element"
                   trigger="click"
                   placement="bottom-end"
                   @command="onOpen">
        <Item>
          <div>开放范围</div>
          <div slot="remark">{{group.isOpen===0?'不公开':group.isOpen===1?'校内公开':'公开'}}</div>
        </Item>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item command="0">不公开</el-dropdown-item>
          <el-dropdown-item command="1">校内公开</el-dropdown-item>
          <el-dropdown-item command="2">公开</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <Item :hasClick="isAdmin"
            @click="onOpen">
        <div>开放范围</div>
        <div slot="remark">{{group.isOpen===0?'不公开':group.isOpen===1?'校内公开':'公开'}}</div>
      </Item>
    </template>
    <Item :hasClick="isAdmin"
          @click="onTeachTime">
      <div>教学时间</div>
      <div slot="remark">{{groupMeta.sessionTime}}</div>
    </Item>
    <Item :hasClick="isAdmin"
          @click="onAddress">
      <div>教学地点</div>
      <div slot="remark">{{groupMeta.address}}</div>
    </Item>
    <Item :hasClick="isAdmin"
          @click="onDescription">
      <div>课程介绍</div>
      <div slot="remark">{{group.description}}</div>
    </Item>
    <Item @click="handleAdmins">
      <div>管理员</div>
      <div slot="remark">
        <template v-for="(u,i) in admins">
          <img class="avatar smaller"
               :key="i"
               v-if="i < 5"
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
    <div class="category-title flex-block"></div>
    <Item @click="handleUserName">
      <div>我的昵称</div>
      <div slot="remark">{{currentUser.name}}</div>
    </Item>
    <div class="list-button"
         v-if="!isOrg && (isAdmin || currentGroup.isWithdraw === 1)">
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="handleSignout">退出群组</el-button>
    </div>
    <Overlay :show.sync="showQrcode"
             :width="300"
             background="transparent">
      <div class="qrcode-container">
        <div>{{school.name}}</div>
        <div>{{group.name}} 编号{{group.groupId}}</div>
        <img v-lazy="{src:url(group.qrcode)}" />
      </div>
    </Overlay>
  </Page>
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
        school: {},
        metaDatas: []
      }
    },
    computed: {
      ...mapGetters({
        getSchool: 'getSchoolBySchoolId'
      }),
      showCatelog() {
        let viewType = this.currentGroup.viewType
        return viewType === '3' || viewType === '4'
      },
      groupMeta() {
        let _groupMeta = {}
        this.metaDatas.some(meta => {
          if (meta.metaType === 'm_course_apply_extension') {
            _groupMeta = JSON.parse(meta.obj)
          }
        })
        return _groupMeta
      }
    },
    created() {
      this.initialize()
    },
    methods: {
      ...mapActions(['modifyGroup', 'modifyRelation']),
      initialize() {
        if (this.groupId) {
          Api.getGroupDetail(this.groupId).then(res => {
            this.group = res.group
            this.metaDatas = res.metaDatas || []
            this.school = this.getSchool(res.group.parentId)
          })
          this.initUser()
        }
      },
      initUser() {
        Api.getGroupUser(this.groupId, this.userId).then(res => {
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
      handleLogo() {
        this.routePush({
          path: '/vx/group/about/banner'
        })
      },
      handleName() {
        this.$prompt(' ', '修改', {
          inputPlaceholder: this.group.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.modify({
              groupId: this.group.groupId,
              id: this.currentGroup.id,
              name: value
            })
          })
          .catch(() => {})
      },
      handleUserName() {
        let that = this
        that
          .$prompt(' ', '修改昵称', {
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
      handleAdmins() {
        this.routePush({
          path: `/vx/group/about/admin`
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
      handleOrg() {
        this.routePush({
          path: '/vx/group/about/superior',
          query: { groupId: this.group.schoolGroupId }
        })
      },
      handleSignout() {
        let that = this
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
              this.routeBack()
            }
          })
        })
      },
      modifyShowMobile() {},
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
      onFlag() {},
      onCourseType(command) {
        this.modify({
          id: this.group.id,
          groupId: this.groupId,
          courseType: command
        })
      },
      onOpen(command) {
        this.modify({
          id: this.group.id,
          groupId: this.groupId,
          isOpen: command
        })
      },
      onAddress() {
        this.$prompt(' ', '修改教学地址', {
          inputValue: this.groupMeta.address,
          inputPlaceholder: this.group.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.modify({
              id: this.group.id,
              groupId: this.groupId,
              address: value
            })
          })
          .catch(() => {})
      },
      onTeachTime() {
        this.$prompt(' ', '修改教学时间', {
          inputValue: this.groupMeta.sessionTime,
          inputPlaceholder: this.group.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.modify({
              id: this.group.id,
              groupId: this.groupId,
              sessionTime: value
            })
          })
          .catch(() => {})
      },
      onDescription() {
        this.$prompt(' ', '修改课程介绍', {
          inputValue: this.group.description,
          inputPlaceholder: this.group.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.modify({
              id: this.group.id,
              groupId: this.groupId,
              description: value
            })
          })
          .catch(() => {})
      },
      modify(d) {
        Api.addCourse({ course: d }).then(res => {
          if (Check.isRealArray(res.groups)) {
            this.modifyGroup(res.groups[0])
            this.group = { ...this.group, ...res.groups[0] }
            this.metaDatas = res.metaDatas
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      }
    },
    watch: {
      showMobile(v) {
        this.modifyShowMobile()
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
