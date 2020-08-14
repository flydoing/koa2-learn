<template>
  <Page title="能力评估"
        ref="_page">
    <el-dropdown slot="btn"
                 trigger="click"
                 @command="handleType">
      <i class="ico ico-more" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(tp, i) in form.types"
                          :key="i"
                          :command="tp">{{tp.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div slot="top"
         class="top-operate">
      <Tabs theme="theme-1"
            @click="handleTab"
            ref="_tab"
            :showBtns="form.tabs.length > 1"
            :value="tabValue">
        <TabPane v-for="tab in form.tabs"
                 :key="tab.name"
                 :label="tab.name"
                 :name="tab.type"
                 :currentData="tab">
        </TabPane>
      </Tabs>
      <!-- <Item :hasClick="false"
            slot="top">
        <div slot="before">
          <i class="ico ico-search"></i></div>
        <input placeholder="搜索"
               v-model="keyword"
               @keyup.enter="handleSearch" />
      </Item> -->
    </div>
    <div class="appraise-list">
      <template v-if="form.tab && form.type">
        <el-collapse accordion
                     v-if="form.datas.length > 0"
                     v-model="form.active">
          <el-collapse-item v-for="(item,i) in form.datas"
                            :key="i"
                            :name="i + 1">
            <template slot="title">
              <item :label="item.title"
                    :hasArrow="false"
                    :remark="item.description"></item>
            </template>
            <template v-if="item.children">
              <div v-for="(child, j) in item.children"
                   :key="j">
                <div class="category-title text">{{child.title}}<span class="right">{{child.description}}</span></div>
                <template v-if="child.participants">
                  <div v-for="(user, k) in child.participants"
                       :ref="'_ref'+user.personNo"
                       :key="k"
                       class="user-panel">
                    <el-dropdown trigger="click"
                                 class="block-element"
                                 @command="handleUser">
                      <ItemList>
                        <div slot="avatar">
                          <img class="avatar"
                               v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
                               alt='头像'>
                        </div>
                        <span slot="title">{{user.name}}</span>
                        <span slot="main">{{user.gender}}</span>
                        <span slot="remark"
                              v-html="remarkTxt(user)"></span>
                      </ItemList>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(op, n) in operates"
                                          :key="n"
                                          :command="convertData(op, item, child, user)">{{op.name}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-else-if="form.tab">
        <el-collapse accordion
                     v-if="form.datas.length > 0"
                     v-model="form.active">
          <el-collapse-item v-for="(item,i) in form.datas"
                            :key="i"
                            :name="i + 1">
            <template slot="title">
              <item :label="item.title"
                    :hasArrow="false"
                    :remark="item.description"></item>
            </template>
            <template v-if="item.participants">
              <div v-for="(user, k) in item.participants"
                   :ref="'_ref'+user.personNo"
                   :key="k"
                   class="user-panel">
                <el-dropdown trigger="click"
                             class="block-element"
                             @command="handleUser">
                  <ItemList>
                    <div slot="avatar">
                      <img class="avatar"
                           v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
                           alt='头像'>
                    </div>
                    <span slot="title">{{user.name}}</span>
                    <span slot="main">{{user.gender}}</span>
                    <span slot="remark"
                          v-html="remarkTxt(user)"></span>
                  </ItemList>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(op, n) in operates"
                                      :key="n"
                                      :command="convertData(op, item, null, user)">{{op.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-else-if="form.type">
        <div v-for="(item, j) in form.datas"
             :key="j">
          <div class="category-title text">{{item.title}}<span class="right">{{item.description}}</span></div>
          <template v-if="item.participants">
            <div v-for="(user, k) in item.participants"
                 :ref="'_ref'+user.personNo"
                 :key="k"
                 class="user-panel">
              <el-dropdown trigger="click"
                           class="block-element"
                           @command="handleUser">
                <ItemList>
                  <div slot="avatar">
                    <img class="avatar"
                         v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
                         alt='头像'>
                  </div>
                  <span slot="title">{{user.name}}</span>
                  <span slot="main">{{user.gender}}</span>
                  <span slot="remark"
                        v-html="remarkTxt(user)"></span>
                </ItemList>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(op, n) in operates"
                                    :key="n"
                                    :command="convertData(op, null, item, user)">{{op.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div v-for="(user, k) in form.datas"
             :ref="'_ref'+user.personNo"
             :key="k"
             class="user-panel">
          <el-dropdown trigger="click"
                       class="block-element"
                       @command="handleUser">
            <ItemList>
              <div slot="avatar">
                <img class="avatar"
                     v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
                     alt='头像'>
              </div>
              <span slot="title">{{user.name}}</span>
              <span slot="main">{{user.gender}}</span>
              <span slot="remark"
                    v-html="remarkTxt(user)"></span>
            </ItemList>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(op, n) in operates"
                                :key="n"
                                :command="convertData(op, null, null, user)">{{op.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </div>
  </Page>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        form: {
          tabs: [],
          tab: null,
          keyword: '',
          datas: [],
          type: null,
          types: [],
          active: 1
        },
        operates: [
          {
            name: '报名详情',
            value: 1
          },
          {
            name: '能力评估',
            value: 2
          },
          {
            name: '分配至',
            value: 3
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      msgId() {
        return this.routeQuery('msgId')
      },
      tabValue() {
        let tab = this.form.tab || {}
        return tab.type || ''
      }
    },
    activated() {
      const that = this
      if (this.obj.form) {
        this.form = JSON.parse(JSON.stringify(this.obj.form))
        this.modifyCreateObjectField('form')
        let refresh = this.getStorage('_1300_appraise_users_refresh')
        if (refresh) {
          this.fetchData()
        }
        if (this.obj.personNo) {
          this.$nextTick(() => {
            that.$refs._page.getScroll().scrollIntoView(that.$refs[`_ref${that.obj.personNo}`][0])
            that.modifyCreateObjectField('personNo')
          })
        }
      } else if (Check.isRealArray(this.obj.tabs)) {
        this.form.tabs = this.obj.tabs
        this.form.tab = this.form.tabs[0]
        this.modifyCreateObjectField('tabs')
        Api.getAppraiseType(this.msgId).then(res => {
          this.form.types = res.datas || []
          this.form.types.push({ name: '导出名单', type: 'export' })
        })
        this.fetchData()
      } else {
        this.fetchData()
      }
      this.modifyCreateObjectField('params')
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      convertData(op, item, child, user) {
        return {
          op: op,
          item: item,
          child: child,
          user: user
        }
      },
      remarkTxt(user) {
        return `${user.answerScore}+${user.evaluatScore}=${user.answerScore + user.evaluatScore}`
      },
      fetchData() {
        let tab = this.form.tab || {}
        let type = this.form.type || {}
        Api.getAppraiseUsers(this.msgId, tab.type, type.id).then(res => {
          this.form.datas = res.aspirations || res.children || res.participants || []
        })
      },
      handleType(tp) {
        if (tp.type === 'export') {
          window.open(`/business/admission/result/export/${this.msgId}`)
          return false
        }
        this.form.type = tp
        this.fetchData()
      },
      handleTab(tab) {
        this.form.tab = tab.sourceData
        this.form.active = 1
        this.fetchData()
      },
      handleUser(data) {
        const that = this
        let cacheData = {
          form: this.form,
          personNo: data.user.personNo
        }
        if (data.op.value === 3) {
          cacheData.params = {
            cback: (item, cback) => {
              Api.modifyDistribution({
                msgId: that.msgId,
                personNo: data.user.personNo,
                aspirationOptionId: item.id
              }).then(res => {
                that.setStorage('_1300_appraise_users_refresh', true)
                that.modifyCreateObjectField('personNo')
                that.$message({ type: 'success', message: '操作成功' })
                cback && cback()
              })
            }
          }
        }
        this.setCreateObject(cacheData)

        let query = {
          msgId: this.msgId,
          personNo: data.user.personNo,
          uname: data.user.name
        }
        if (data.item !== null) {
          query.formId = data.item.id
        }
        if (data.op.value === 1) {
          this.routePush({
            path: '/vx/group/business/1300/detail',
            query: query
          })
        } else if (data.op.value === 2) {
          this.routePush({
            path: '/vx/group/business/1300/appraise/detail',
            query: query
          })
        } else {
          delete query.personNo
          this.routePush({
            path: '/vx/group/business/1300/appraise/distribute',
            query: { ...query, title: `分配至 - ${data.user.name}` }
          })
        }
      },
      handleSearch() {}
    }
  }
</script>
<style lang="scss">
  .top-operate {
    border-bottom: rem(1) solid #ededed;
  }
  .appraise-list {
    .vx-item {
      &.is-click:hover {
        background: #fff;
      }
      cursor: pointer;
    }
    .el-collapse {
      border-top: 0 !important;
      .el-collapse-item__content {
        padding-bottom: 0 !important;
        .user-panel {
          border-bottom: rem(1) solid #ededed;
          &:last-child {
            border-bottom: 0;
          }
          .vx-item:after {
            height: 0;
            top: 0;
          }
        }
      }
    }
  }
</style>
