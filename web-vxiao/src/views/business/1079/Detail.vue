<template>
  <Page title="代理商详情">
    <label slot="btn"
           v-if="canEdit"
           @click="handleEdit">编辑</label>
    <div class="agent-detail">
      <item label="名称"
            :hasClick="false"
            :remark="form.name">
      </item>
      <item label="来源"
            :hasClick="false"
            :remark="form.source"></item>
      <item label="进展"
            :hasClick="false"
            :remark="form.progress"></item>
      <item label="微信群"
            :hasClick="false"
            :remark="form.state"></item>
      <item label="学校资源数量"
            :hasClick="false"
            :remark="form.count">
        <div slot="after">所</div>
      </item>
      <item label="人员规模"
            :hasClick="false"
            :remark="form.scale">
      </item>
      <item label="年销售（万元）"
            :hasClick="false"
            :remark="form.amount">
      </item>
      <item label="区域地位"
            :hasClick="false"
            :remark="form.status">
      </item>
      <item label="主营产品/品牌"
            :hasClick="false"
            :remark="form.brand">
      </item>
      <item label="合作意向"
            :hasClick="false"
            :remark="form.intention"></item>
      <item label="手机/电话"
            :hasClick="false"
            :remark="form.mobile">
      </item>
      <item label="电子邮件"
            :hasClick="false"
            :remark="form.email">
      </item>
      <item label="所在地"
            :hasClick="false"
            :remark="form.location">
      </item>
      <item label="地址"
            :hasClick="false"
            :remark="form.address"></item>
      <div class="synopsis">简介：{{form.synopsis}}</div>
      <div class="category-title text">联系人</div>
      <ItemList v-for="(user, i) in form.contacts"
                :key="i"
                @click="handleContact(user)">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(user.avatar),error:Image.ICO_AVATAR}">
        <span slot="title">{{user.name}}</span>
        <span slot="main">{{user.mobile}}</span>
        <span slot="remark">{{user.job}}</span>
      </ItemList>
      <div class="category-title"></div>
      <item label="客户经理"
            :hasClick="false"
            :remark="cManagerTxt"></item>
      <item label="线上产品经理"
            :hasClick="false"
            :remark="onManagerTxt"></item>
      <item label="线下产品经理"
            :hasClick="false"
            :remark="offManagerTxt"></item>
      <item label="相关人"
            :hasClick="false"
            :remark="relationTxt"></item>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          source: '', // 来源
          progress: '', // 合作进展
          state: '', // 微信群状态
          count: '', // 学校资源数量
          scale: '', // 人员规模
          amount: '', // 年销售（万元）
          status: '', // 区域地位
          brand: '', // 主营产品/品牌
          intention: '', // 合作意向
          mobile: '', // 手机/电话
          email: '', // 电子邮件
          location: '', // 所在地
          address: '', // 地址
          synopsis: '', // 简介
          contacts: [], // 联系人
          cManager: null, // 客户经理
          onManager: null, // 线上产品经理
          offManager: null, // 线下产品经理
          relations: [], // 相关人,
          area: {},
          provinces: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      canEdit() {
        return this.admin || this.form.userId === this.userId
      },
      cManagerTxt() {
        let cManager = this.form.cManager || {}
        return cManager.name || ''
      },
      onManagerTxt() {
        let onManager = this.form.onManager || {}
        return onManager.name || ''
      },
      offManagerTxt() {
        let offManager = this.form.offManager || {}
        return offManager.name || ''
      },
      relationTxt() {
        let relations = this.form.relations
        if (Check.isRealArray(relations)) {
          let users = relations.map(v => {
            return v.name
          })
          return users.join('、')
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setCrm']),
      fetchData() {
        let aid = this.routeQuery('aid')
        if (aid) {
          MessageApi.getMessageById(aid).then(res => {
            if (res.message) {
              let m = res.message
              let mJson = JSON.parse(m.msgJson || '{}').user || {}
              this.form = {
                ...this.form,
                id: m.id || void 0,
                userId: m.fromUserId,
                name: mJson.name,
                count: mJson.resourceNum || '', // 学校资源数量
                scale: mJson.companySize || '', // 人员规模
                amount: mJson.salesAmount || '', // 年销售（万元）
                status: mJson.region || '', // 区域地位
                brand: mJson.majorProduct || '', // 主营产品/品牌
                mobile: mJson.mobile || '', // 手机/电话
                email: mJson.email || '', // 电子邮件
                synopsis: mJson.introduce || '', // 简介
                source: mJson.sourceType,
                progress: mJson.coopProgress,
                state: mJson.weChatGroupJoined,
                intention: mJson.levelName,
                contacts: mJson.contacts,
                address: mJson.address,
                location: `${mJson.province || ''} ${mJson.city || ''} ${mJson.area || ''}`
              }

              let relations = []
              if (Check.isRealArray(m.toUsers)) {
                m.toUsers.forEach(v => {
                  if (v.extension === '1') {
                    this.form.cManager = v
                  } else if (v.extension === '2') {
                    this.form.onManager = v
                  } else if (v.extension === '3') {
                    this.form.offManager = v
                  } else if (v.type === 'cc') {
                    relations.push(v)
                  }
                })
              }
              this.form.relations = relations
            }
          })
        }
      },
      handleContact(user) {
        this.setCrm({ contact: user, canEdit: false })
        this.routePush({ path: '/vx/group/business/1046/contactEdit' })
      },
      handleEdit() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1079',
            groupId: this.groupId,
            aid: this.form.id
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .agent-detail {
    .synopsis {
      padding: rem(10);
    }
  }
</style>
