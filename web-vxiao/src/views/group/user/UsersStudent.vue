<template>
  <Page title="学生"
        ref="_page">
    <label slot="btn"
           v-if="(isAdmin || isTeacher)"
           @click="onBatchAvatar">导入头像</label>
    <template v-if="isAdmin && type==='name'">
      <label slot="btn"
             @click="removeMode =! removeMode">{{removeMode ? '取消移除' : '移除成员'}}</label>
    </template>
    <template v-if="(isAdmin || isTeacher) && type==='seat'">
      <label slot="btn"
             @click="handleSeatImport">导入</label>
      <label slot="btn"
             @click="handleSeatEdit">编辑</label>
    </template>
    <Item :hasClick="false"
          slot="top"
          class="full-input search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索"
             v-model="search" />
    </Item>
    <Tabs @click="tabClick"
          ref="_tabs">
      <TabPane label="姓名"
               name="name">
        <Scroller :height="sh"
                  ref="_tab1_scroll">
          <template v-for="(v,k,i) in searchUsers">
            <div v-if="v.length > 0"
                 :key="i"
                 :id="'key_'+k">
              <div class="category-title text"
                   :ref="k">{{k}}</div>
              <ItemList v-for="(u,j) in v"
                        :key="j"
                        @click="handleUser(u)">
                <div slot="before"
                     v-if="removeMode"
                     @click.stop="handleDelete(u)">
                  <i class="ico ico-delete" />
                </div>
                <img slot="avatar"
                     class="avatar"
                     v-lazy="{src:url(u.avatar),error:Image.ICO_USER}"
                     alt='头像'>
                <span slot="title">{{u.name}}</span>
                <span slot="main">{{u | filterType}}</span>
                <span slot="remark"></span>
                <span slot="describe">{{u.subject}}</span>
                <template slot="after">&nbsp;</template>
              </ItemList>
            </div>
          </template>
        </Scroller>
      </TabPane>
      <TabPane label="学号"
               name="number">
        <Scroller :height="sh">
          <ItemList v-for="(u,j) in numberStudents"
                    :key="j"
                    @click="handleUser(u)">
            <img slot="avatar"
                 class="avatar"
                 v-lazy="{src:url(u.avatar),error:Image.ICO_USER}"
                 alt='头像'>
            <span slot="title">{{u.name}}</span>
            <span slot="main">{{u.studentNo}}</span>
            <span slot="remark"></span>
            <span slot="describe">{{u.subject}}</span>

          </ItemList>
        </Scroller>
      </TabPane>
      <TabPane label="座位表"
               name="seat">
        <SeatList></SeatList>
      </TabPane>
    </Tabs>
    <Alphabet slot="other"
              :indexs="searchIndex"
              @click="scrollToIndex" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Check from '@/utils/check'
  import Api from '@/api/group'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane,
      SeatList: resolve => require(['@/views/business/seat/List'], resolve)
    },
    data() {
      return {
        search: '',
        sh: '',
        type: 'name',
        removeMode: false
      }
    },
    computed: {
      selectUsers() {
        // 通讯录只需要展示学生和老师
        return this.getGroupUsers(this.groupId, '4') || []
      },
      numberStudents() {
        let search = this.search.toLowerCase()
        let arr = this.selectUsers
        if (!arr) {
          return []
        }
        if (search) {
          arr = this.selectUsers.filter(user => {
            return user.name.toLowerCase().indexOf(search) > -1 || user.pinyin.toLowerCase().indexOf(search) > -1
          })
        }
        return arr.sort((a, b) => {
          let aNumber = a.studentNo || 0
          let bNumber = b.studentNo || 0
          return bNumber - aNumber
        })
      }
    },
    methods: {
      tabClick(tab) {
        this.type = tab.name
      },
      handleDelete(u) {
        let that = this
        this.$confirm(`确定移除 ${u.name} ?`, '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              Api.addGroupRelation({
                relations: [{ ...u, ...{ status: 'd' } }]
              }).then(res => {
                done()
                instance.confirmButtonLoading = false
                if (Check.isRealArray(res.relations)) {
                  res.relations.forEach(r => {
                    that.modifyRelation(r)
                  })
                  that.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                }
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      },
      handleUser(u) {
        this.routePush({
          name: 'userDetail',
          params: { userId: u.userId },
          query: {
            userId: u.userId,
            title: u.name
          }
        })
      },
      handleSeatImport() {
        this.$import({
          title: '导入座位表',
          uploadURI: `${this.$store.state.FILE_URL}/readExcel`,
          templateUrl: `/business/seating/template/download/${this.currentGroup.groupId}`,
          callback: (res, file) => {
            this.setStorage('seat_table_import_cache', res.dataGirds)
            this.routePush({ name: 'seatImportView' })
          }
        })
      },
      handleSeatEdit() {
        this.routePush({ name: 'seatEdit' })
      },
      scrollToIndex(index) {
        this.$refs._tab1_scroll.scrollbar.scrollIntoView(this.$refs[index][0])
      },
      onBatchAvatar() {
        this.routePush({
          path: '/vx/group/user/batch/avatar'
        })
      }
    },
    filters: {
      filterType(u) {
        return u.studentNo || u.mobile || ''
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.sh = this.innerHeight - 125 - 40 - 90
      })
    }
  }
</script>
