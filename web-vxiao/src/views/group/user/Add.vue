<template>
  <Page title="添加成员"
        :hasClose="false"
        hasSubmit
        @submit="onSubmit">
    <OrdinaryUser v-if="isOrdinary"
                  :users.sync="users"
                  @new="onAdd" />
    <ClassUser v-else-if="isClass"
               :user.sync="user"
               @new="onAdd" />
    <div class="category-title"></div>
    <Item @click="onApply">
      <div>入群申请</div>
    </Item>
    <div class="category-title"></div>
    <Item @click="onImport">
      <div>从文件导入</div>
    </Item>
    <div class="category-title text">从其他群组邀请</div>
    <div class="other-group-list">
      <el-collapse accordion
                   v-model="active">
        <el-collapse-item v-for="(item,i) in gp.datas"
                          :key="i"
                          :name="i + 1">
          <template slot="title">
            <item :label="item.name"
                  :hasArrow="false"></item>
          </template>
          <template v-if="item.children">
            <item v-for="(data,j) in item.children"
                  :key="j"
                  :hasArrow="false"
                  :label="data.name"
                  @click="onGroup(data)">
              <div slot="before">
                <img v-lazy="{src:'/static/ico/ico_angle.png'}">
              </div>
            </item>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <template v-if="gp.others">
      <div class="category-title"></div>
      <item v-for="(data,j) in gp.others"
            :key="j"
            :label="data.name"
            @click="onGroup(data)">
      </item>
    </template>
  </Page>
</template>
<script>
  import R from '../mixin'
  import Check from '@/utils/check'
  import UserEnum from '@/constant/user'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      OrdinaryUser: resolve => require(['./AddOrdinaryUser'], resolve),
      ClassUser: resolve => require(['./AddClassUser'], resolve)
    },
    data() {
      return {
        users: [], // 群组
        user: {}, // 班级
        active: 1
      }
    },
    computed: {
      ...mapGetters(['getGroups']),
      gp() {
        let subs = []
        let superiors = []
        let groups = this.getGroups || []
        groups.forEach(v => {
          if (v.type === '5') {
            superiors.push(v)
          } else if (v.type === '1' || v.type === '2' || v.type === '23') {
            subs.push(v)
          }
        })
        let sMap = new Map()
        superiors.forEach(v => {
          sMap.set(v.parentId, { ...v, children: [] })
        })
        let others = []
        subs.forEach(v => {
          let superior = sMap.get(v.parentId)
          if (superior) {
            superior.children.push(v)
            sMap.set(v.parentId, superior)
          } else {
            others.push(v)
          }
        })
        return {
          datas: [...sMap.values()],
          others: others
        }
      }
    },
    created() {
      this.onAdd()
    },
    methods: {
      ...mapActions(['addGroupUsers']),
      onImport() {
        this.routePush({
          path: '/vx/group/user/import'
        })
      },
      onAdd(student) {
        let _u = {
          name: '',
          mobile: '',
          groupId: this.groupId,
          userType: 1,
          birthDay: '',
          sex: '1'
        }
        if (this.isOrdinary) {
          this.users.push(_u)
        } else if (this.isClass) {
          let _student = {
            birthDay: '',
            groupId: this.groupId,
            name: '',
            sex: '1',
            userType: UserEnum.STUDENT.key
          }
          if (student) {
            this.user.userRelations.push(_student)
          } else {
            this.user = {
              ..._u,
              metaDatas: [],
              userType: UserEnum.PARENT.key,
              userRelations: [_student]
            }
          }
        }
      },
      onSubmit() {
        if (this.isOrdinary) {
          let _users = this.users.filter(u => {
            return !Check.isNullString(u.name) && !Check.isNullString(u.mobile)
          })
          if (Check.isRealArray(_users)) {
            this.addGroupUsers({ relations: _users }).then(res => {
              this.users = []
              this.onAdd()
              this.$message({ type: 'success', message: '添加成功' })
            })
          } else {
            this.$mesasge({ type: 'warning', message: '成员数据不能为空' })
          }
        } else if (this.isClass) {
          let _u = { ...this.user }
          // 管理员给学生添加家长时，手机号改为选填（配合家长人脸录入）
          if (_u.userType === '3') {
            if (Check.isNullString(_u.name)) {
              this.$message({ type: 'warning', message: '姓名不能为空' })
              return true
            }
          } else {
            if (Check.isNullString(_u.name) || Check.isNullString(_u.mobile)) {
              this.$message({ type: 'warning', message: '姓名、手机号码不能为空' })
              return true
            }
          }
          if (_u.userType === UserEnum.TEACHER.key || _u.userType === UserEnum.STUDENT.key) {
            delete _u.userRelations
          } else if (_u.userType === UserEnum.PARENT.key) {
            let students = _u.userRelations.filter(s => {
              return !Check.isNullString(s.name)
            })
            if (!Check.isRealArray(students)) {
              this.$mesasge({ type: 'warning', message: '学生姓名不能为空' })
              return
            }
            _u.userRelations = students
          }
          this.addGroupUsers({ relations: [_u] }).then(res => {
            this.user = {}
            this.onAdd()
            this.$message({ type: 'success', message: '添加成功' })
          })
        }
      },
      onGroup(g) {
        this.routePush({
          path: '/vx/group/user/add/selectUser',
          query: {
            gId: this.groupId,
            groupId: g.groupId,
            isClass: this.isClass,
            title: g.name
          }
        })
      },
      onApply(g) {
        this.routePush({
          path: '/vx/group/user/apply'
        })
      }
    }
  }
</script>
<style lang="scss">
  .other-group-list {
    .vx-item {
      &.is-click:hover {
        background: #fff;
      }
      cursor: pointer;
    }
    .el-collapse {
      border-top: 0 !important;
    }
    .el-collapse-item__content {
      padding-bottom: 0 !important;
      & > div:last-child {
        &:after {
          height: 0;
        }
      }
    }
  }
</style>
