<template>
  <AppPage :title="app.name"
           @scrollEnd="scrollEnd">
    <template v-if="hasSearch">
      <Item :hasClick="false"
            fullInput
            slot="top"
            class="search">
        <div slot="before">
          <i class="ico ico-search"></i>
        </div>
        <input placeholder="搜索"
               v-model="keyword" />
      </Item>
      <div class="category-title"></div>
    </template>
    <AppCommon :app="curApp" />
    <div class="category-title"
         v-if="messages.length > 0 || groups.length > 0"></div>
    <template v-if="isOrg && groups.length>0">
      <Item v-for="g in groups"
            :key="g.groupId"
            @click="handleGroup(g)">
        <div>{{g.name}}</div>
      </Item>
    </template>
    <template v-else>
      <div class="students">
        <template v-for="(msg, i) in messages">
          <CardColumn v-if="messages.length>0"
                      :key="i"
                      :message="msg"
                      @click="CardColumnClick(msg)">
            <CardDown slot="down"
                      :m="msg">
              <el-dropdown-item v-if="autoPublish && (isSuperAdmin || isTeacher || isAdmin)"
                                @click.native.stop="handlePublish(msg, i)">{{publishTxt(msg)}}</el-dropdown-item>
            </CardDown>
          </CardColumn>
        </template>
        <div v-if="hasNextPage===0"
             class="vx-more">没有更多了</div>
      </div>
    </template>
  </AppPage>
</template>
<script>
  import Api from '@/api/message'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters } from 'vuex'
  export default {
    props: { app: Object, hasSearch: { type: Boolean, default: true } },
    mixins: [R, MixinMessage],
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve),
      CardColumn: resolve => require(['@/views/components/card/CardColumn'], resolve)
    },
    data() {
      return {
        messages: [],
        hasNextPage: 0,
        currentPage: 1,
        keyword: '',
        groups: []
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId'
      }),
      autoMeta() {
        const that = this
        let school = that.getSchool(that.currentGroup.parentId)
        let meta = this.metaDatas.filter(m => {
          return m.metaType === 'm_auto_sendmsg_vscreen' && m.extension === school.groupId
        })[0]
        return meta
      },
      autoPublish() {
        return this.autoMeta && this.autoMeta.obj === '1'
      },
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      publishTxt(m) {
        return m.action !== '1' ? '发布到班牌' : '取消班牌显示'
      },
      handlePublish(m, index) {
        const that = this
        let message = { ...m, action: m.action !== '1' ? '1' : '0' }
        that.modifyMessage(message).then(res => {
          that.$set(that.messages[index], 'action', message.action)
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      loadMsgList(queryType, $load) {
        const that = this
        Api.getMessages({
          groupId: that.groupId,
          currentPage: that.currentPage,
          keyword: that.keyword !== '' ? that.keyword : void 0,
          queryType: that.keyword !== '' ? 'keyword' : 'type',
          type: '1163'
        })
          .then(res => {
            if (res.hasNextPage > 0) {
              that.hasNextPage = res.hasNextPage
              that.currentPage = res.currentPage
            } else {
              that.hasNextPage = 0
            }
            queryType === 'more' ? (that.messages = [...that.messages, ...res.messages]) : (that.messages = res.messages || [])
            $load && $load.close()
          })
          .catch(res => {
            $load && $load.close()
          })
      },
      fetchData() {
        if (this.isOrg) {
          GroupApi.getAppGroups(this.currentGroup.parentId, this.curApp.type).then(res => {
            let groups = []
            if (Check.isRealArray(res.groups)) {
              res.groups.map(v => {
                v.groups.map(g => {
                  groups.push(g)
                })
              })
              if (groups.length > 1) {
                this.groups = groups
              } else {
                this.loadMsgList()
              }
            }
          })
        } else {
          this.loadMsgList()
        }
      },
      handleGroup(g) {
        this.setStorage('_message_params_cache', {
          type: '1163',
          groupId: g.groupId,
          queryType: 'keyword'
        })
        this.setStorage('_message_list_refresh', true)
        this.routePush({
          path: '/vx/group/business/message/list',
          query: { title: g.name }
        })
      },
      scrollEnd(status, $load) {
        this.hasNextPage > 0 && this.loadMsgList('more', $load)
      },
      CardColumnClick(m) {
        this.routePush({
          name: 'cardDetail1162',
          params: {
            msgId: m.id
          },
          query: {
            type: m.type
          }
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.fetchData()
      })
    },
    watch: {
      keyword(v) {
        this.initData()
        this.fetchData()
      },
      currentApp(v) {
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .students {
    background-color: #ededed;
  }
</style>
