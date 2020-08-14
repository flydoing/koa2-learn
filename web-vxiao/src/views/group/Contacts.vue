<template>
  <div class="vx-info-container">
    <!-- <Item :hasClick="false"
          class="full-input">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索"
             v-model="search" />
    </Item> -->
    <scroller ref="_scroll"
              :height="shNoSearch">
      <template v-if="isOrg">
        <ItemList @click="onOrganization"
                  v-if="isAdmin">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_APPYL}">
          <span slot="title">组织架构</span>
        </ItemList>
        <ItemList @click="onAuth"
                  v-if="isAdmin">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_APPYL}">
          <span slot="title">群组申请</span>
        </ItemList>
        <template v-for="(v,k) in dataMap">
          <template v-if="v.length > 0">
            <div :key="k">
              <div class="category-title"></div>
              <template v-if="k==='部门'">
                <template v-for="g in v">
                  <ItemList @click="onGroup(g)"
                            :key="g.groupId">
                    <img slot="avatar"
                         class="avatar"
                         v-lazy="{src:url(g.logo,'thumb'),error:Image.ICO_GROUP}">
                    <span slot="title">{{g.name}}</span>
                    <span slot="main">{{g.remark}}</span>
                    <template slot="after"
                              v-if="!isAdmin"></template>
                  </ItemList>
                  <ItemList v-for="c in g.groups"
                            :key='c.groupId'
                            @click="onSubordinate(c)">
                    <div slot="before">
                      <img class="angle"
                           v-lazy="{src:'/static/ico/ico_angle.png'}">
                    </div>
                    <img slot="avatar"
                         class="avatar"
                         v-lazy="{src:url(c.logo,'thumb'),error:Image.ICO_GROUP}">
                    <span slot="title">{{c.name}}</span>
                    <span slot="main">{{c.remark}}</span>
                    <template slot="after"
                              v-if="!isAdmin"></template>
                  </ItemList>
                </template>
              </template>
              <template v-else>
                <ItemList v-for="g in v"
                          :key="g.groupId"
                          @click="onGroup(g)">
                  <img slot="avatar"
                       class="avatar"
                       v-lazy="{src:url(g.logo,'thumb'),error:Image.ICO_GROUP}">
                  <span slot="title">{{g.name}}</span>
                  <span slot="main">{{g.remark}}</span>
                  <template slot="after"
                            v-if="!isAdmin"></template>
                </ItemList>
              </template>
            </div>
          </template>
        </template>
        <template v-if="isSchool">
          <div class="category-title"></div>
          <ItemList @click="onAssociation">
            <img slot="avatar"
                 class="avatar"
                 v-lazy="{src:Image.ICO_GRADUATION}">
            <span slot="title">社团</span>
          </ItemList>
          <ItemList @click="onCourse">
            <img slot="avatar"
                 class="avatar"
                 v-lazy="{src:Image.ICO_GRADUATION}">
            <span slot="title">课程</span>
          </ItemList>
          <ItemList @click="onGraduation">
            <img slot="avatar"
                 class="avatar"
                 v-lazy="{src:Image.ICO_GRADUATION}">
            <span slot="title">毕业班级</span>
          </ItemList>
        </template>
      </template>
      <template v-else>
        <ItemList @click="onAddUser"
                  v-if="currentGroup.isInvite === 1 || isAdmin">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_PLUS}">
          <span slot="title">邀请成员</span>
        </ItemList>
        <template v-if="currentGroup.isAddressList === 1 || isAdmin">
          <ItemList @click="onTeam">
            <img slot="avatar"
                 class="avatar"
                 v-lazy="{src:Image.ICO_TEAM}">
            <span slot="title">小组</span>
          </ItemList>
          <template v-if="isClass">
            <ItemList @click="onNo">
              <img slot="avatar"
                   class="avatar"
                   v-lazy="{src:Image.ICO_NO}">
              <span slot="title">学号</span>
            </ItemList>
            <ItemList @click="onSeat">
              <img slot="avatar"
                   class="avatar"
                   v-lazy="{src:Image.ICO_SEAT}">
              <span slot="title">座位</span>
            </ItemList>
          </template>
        </template>
        <!-- 用户列表 -->
        <template v-if="currentGroup.isAddressList === 1 || isAdmin">
          <template v-for="(v,k,i) in searchUsers">
            <div :key="i"
                 :id="'key_'+k"
                 v-if=" v.length > 0">
              <div class="category-title text"
                   :ref="k">
                <span>{{k}}</span>
              </div>
              <ItemList class="contact-user"
                        v-for="u in v"
                        :key="u.userId"
                        @click="onUser(u)">
                <img slot="avatar"
                     class="avatar"
                     v-lazy="{src:url(u.avatar,'thumb'),error:Image.ICO_USER}">
                <span slot="title">{{u.name}}</span>
                <span slot="main">{{u | filterType}}</span>
                <span slot="remark"></span>
                <span slot="describe">{{u.subject}}</span>
                <template slot="after">&nbsp;</template>
              </ItemList>
            </div>
          </template>
        </template>
        <ItemList @click="onRemove"
                  v-if="isAdmin">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_REDUCE}">
          <span slot="title">移除成员</span>
        </ItemList>
        <ItemList @click="onBatchAvatar"
                  v-if="isAdmin && !isOrg">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_BATCH_IMPORT}">
          <span slot="title">导入头像</span>
        </ItemList>
        <ItemList @click="onBatchFace"
                  v-if="isAdmin && !isOrg">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:Image.ICO_BATCH_IMPORT}">
          <span slot="title">导入人脸</span>
        </ItemList>
        <template v-if="currentGroup.isAddressList !== 1 && !isAdmin">
          <CardTips text="没有查看权限"
                    fontSize="14" />
        </template>
      </template>
    </scroller>
    <template v-if="currentGroup.isAddressList === 1 || isAdmin">
      <Alphabet slot="other"
                v-if="!isOrg"
                :indexs="searchIndex"
                @click="scrollToIndex" />
    </template>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        classes: [],
        groups: [],
        schools: []
      }
    },
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    computed: {
      selectUsers() {
        // 通讯录只需要展示学生和老师
        return this.getGroupUsers(this.groupId, '1_2_4') || []
      },
      sh() {
        return this.innerHeight - 75 - 40 - 10 - 45
      },
      shNoSearch() {
        return this.innerHeight - 75 - 40 - 10
      },
      dataMap() {
        let search = this.search.toLowerCase()
        let _school = this.schools
        let _groups = this.treeGroups
        let _classes = this.classes
        if (!Check.isNullString(search)) {
          return {
            部门: _groups.filter(g => {
              return g.name.toLowerCase().indexOf(search) > -1 || g.groupId.indexOf(search) > -1
            }),
            学校: _school.filter(g => {
              return g.name.toLowerCase().indexOf(search) > -1 || g.groupId.indexOf(search) > -1
            }),
            班级: _classes.filter(g => {
              return g.name.toLowerCase().indexOf(search) > -1 || g.groupId.indexOf(search) > -1
            })
          }
        }
        return {
          部门: this.groups,
          学校: this.schools,
          班级: this.classes
        }
      }
    },
    methods: {
      ...mapActions(['modifyBranchId', 'modifyEducationId']),
      loadGroups() {
        if (this.currentGroup.parentId) {
          GroupApi.getSchoolAllGroups(this.currentGroup.parentId).then(res => {
            this.classes = res.classes || []
            this.groups = res.treeGroups || []
            this.schools = res.schoolGroups || []
          })
        }
      },
      onOrganization() {
        this.routePush({
          name: 'groupOrganization'
        })
      },
      onSubordinate(g) {
        if (g.childCount > 0) {
          this.setStorage(`_cache_root_group_${g.id}`, g)
          this.routePush({
            name: 'groupTree',
            params: { id: g.id },
            query: { title: g.name }
          })
        } else {
          this.modifyBranchId(g.groupId)
          this.routePush({
            name: 'groupBranch',
            params: {
              branchId: g.groupId
            }
          })
        }
      },
      onGroup(g) {
        if (!this.isAdmin) {
          this.$message({ type: 'warning', message: '只有管理员才能查看' })
        }

        if (g.type === '5') {
          this.modifyEducationId(g.groupId)
          this.routePush({
            name: 'groupEducation',
            params: {
              educationId: g.groupId
            }
          })
        } else {
          this.modifyBranchId(g.groupId)
          this.routePush({
            name: 'groupBranch',
            params: {
              branchId: g.groupId
            }
          })
        }
      },
      onAddUser() {
        this.routePush({
          path: '/vx/group/user/add'
        })
      },
      onRemove() {
        this.routePush({
          path: '/vx/group/user',
          query: {
            remove: true
          }
        })
      },
      onTeam() {
        this.routePush({
          path: '/vx/group/user/team'
        })
      },
      onNo() {
        this.routePush({
          path: '/vx/group/user/no'
        })
      },
      onSeat() {
        this.routePush({
          path: '/vx/group/business/seat'
        })
      },
      onUser(user) {
        this.routePush({
          name: 'userDetail',
          params: { userId: user.userId },
          query: {
            title: user.name,
            groupId: user.groupId
          }
        })
      },
      onDepartment() {
        this.routePush({
          name: 'basiceManager'
        })
      },
      // 群组申请认证
      onAuth() {
        if (this.isEducation) {
          this.routePush({
            name: 'basiceApplyList'
          })
        } else {
          this.routePush({
            name: 'basiceUncertified'
          })
        }
      },
      onGraduation() {
        this.routePush({
          name: 'basiceGraduation'
        })
      },
      onAssociation() {
        this.routePush({
          name: 'basiceAssociation'
        })
      },
      onCourse() {
        this.routePush({
          name: 'basiceCourse'
        })
      },
      onBatchAvatar() {
        this.routePush({
          path: '/vx/group/user/batch/avatar'
        })
      },
      onBatchFace() {
        this.routePush({
          path: '/vx/group/user/batch/face'
        })
      },
      scrollToKey() {
        setTimeout(() => {
          let queryKey = this.routeQuery('key')
          if (queryKey === 'teacher') {
            this.scrollToIndex('师')
          } else if (queryKey === 'student') {
            let i = this.searchIndex.findIndex(a => {
              return a === '师'
            })
            this.scrollToIndex(this.searchIndex[i + 1])
          }
        }, 100)
      },
      scrollToIndex(index) {
        this.$refs._scroll.scrollbar.scrollIntoView(this.$refs[index][0])
      }
    },
    activated() {
      this.removeStorage('_cache_root_group_')
      this.scrollToKey()
      if (this.isOrg) {
        this.loadGroups()
      }
    },
    filters: {
      filterType(u) {
        return u.studentNo || u.mobile || ''
      }
    },
    watch: {
      currentGroup() {
        if (this.isOrg) {
          this.loadGroups()
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-info-container {
    background: nth($background, 6);
  }
  .contact-user {
    .describe {
      width: rem(80);
    }
  }
  .angle {
    margin-left: rem(14);
  }
</style>
