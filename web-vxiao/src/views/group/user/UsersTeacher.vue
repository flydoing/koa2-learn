<template>
  <Page title="通讯录"
        ref="_page">
    <label slot="btn"
           @click="removeMode=!removeMode">{{removeMode ? '取消移除' : '移除成员'}}</label>
    <item :hasClick="false"
          slot="top"
          class="full-input search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索"
             v-model="search" />
      <span slot="after"></span>
    </item>
    <template v-for="(v,k,i) in searchUsers">
      <div v-if=" v.length > 0"
           :key="i"
           :id="'key_'+k">
        <div class="category-title text"
             :ref="k">{{k}}</div>
        <ItemList v-for="u in v"
                  :key="u.userId"
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
    <Alphabet slot="other"
              :indexs="searchIndex"
              @click="scrollToIndex" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '@/api/group'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    created() {},
    computed: {
      selectUsers() {
        return this.getGroupUsers(this.groupId, '1_2') || []
      },
      searchUsers() {
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
        let obj = {}
        let others = []
        arr.forEach(user => {
          let letter = user.pinyin ? user.pinyin.charAt(0).toLocaleUpperCase() : ''
          const p = /[a-z]/i
          if (!p.test(letter)) {
            others.push(user)
            return null
          }
          if (obj.hasOwnProperty(letter)) {
            obj[letter].push(user)
          } else {
            obj[letter] = [user]
          }
        })
        if (others && others.length > 0) {
          obj['#'] = others
        }
        return obj
      }
    },
    data() {
      return {
        sh: '',
        removeMode: false
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      handleUser(user) {
        this.routePush({
          name: 'userDetail',
          params: { userId: user.userId },
          query: {
            title: user.name
          }
        })
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
      }
    },
    filters: {
      filterType(u) {
        return u.studentNo || u.mobile || ''
      }
    },
    mounted() {
      this.scrollToKey()
    },
    watch: {
      groupUserText() {
        // this.scrollToKey()
      }
    }
  }
</script>
