<template>
  <page title="新建表彰"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <label slot="btn"
           @click='onDraft'>存草稿</label>
    <div class="category-title template"
         @click="onOptionalModule"
         v-if="count">可选模板{{`（${count}）`}}</div>
    <div class="commend-create">
      <item @click="handleType">
        <div slot="main">表彰类型</div>
        <div slot="remark"
             v-if="cmdn.type"
             v-html="cmdn.type.name"></div>
      </item>
      <item @click="handleObject">
        <div slot="main">表彰对象</div>
        <div slot="remark"
             class="ellipsis"
             v-html="memberTxt"></div>
      </item>
      <div class="cmd-desc">
        <TextInput class="textarea-content"
                   placeholder="表彰内容"
                   v-model="cmdn.content" />
      </div>
      <item @click="handleTemplate">
        <div slot="main">模板</div>
        <img slot="remark"
             class="cmd-temp"
             v-lazy="{src:logo}"
             alt='LOGO' />
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        cmdn: {
          type: {
            name: ''
          },
          content: '',
          template: null,
          objects: [],
          members: [],
          isClass: false
        },
        count: ''
      }
    },
    created() {
      this.getTemplatesCount()
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId',
        commend: 'getCommend'
      }),
      objData() {
        let mbs = []
        let objects = this.cmdn.objects
        if (Check.isRealArray(objects)) {
          objects.map(g => {
            mbs.push(...g.members)
          })
        }
        return { caches: objects, txt: mbs.length > 0 ? `${mbs.length}位成员 ` : '' }
      },
      memberTxt() {
        if (this.isClass) {
          let mbs = this.cmdn.members
          return mbs.length > 0 ? `${mbs.length}位成员 ` : ''
        } else {
          return this.objData.txt
        }
      },
      singleMeta() {
        const that = this
        let groupId = that.currentGroup.groupId
        if (that.isClass) {
          groupId = that.getSchool(that.currentGroup.parentId).groupId
        }
        let metas = that.metaDatas.filter(m => {
          return m.metaType === 't_commend_single_user' && m.extension === groupId
        })
        return Check.isRealArray(metas) ? metas[0] : null
      },
      logo() {
        return this.cmdn.template ? this.url(this.cmdn.template.logo) : ''
      }
    },
    methods: {
      ...mapActions(['setCommend', 'deleteCommendProp']),
      getTemplatesCount() {
        MessageApi.getTemplatesCount(this.currentGroup.parentId, '1048').then(res => {
          if (res.code === '1') {
            this.count = res.count
          }
        })
      },
      fetchData() {
        // 拿到模板
        let msgTmp = this.getStorage('_message_template_cache')
        if (msgTmp) {
          let jsonTmp = JSON.parse(msgTmp.msgJson)
          this.cmdn = {
            content: msgTmp.content,
            template: jsonTmp,
            type: {
              name: msgTmp.categoryName
            }
          }
        }
        let cmdn = this.commend.cmdn
        if (cmdn && cmdn.isClass === this.isClass) {
          this.cmdn = cmdn
          if (Check.isRealArray(this.commend.users)) {
            this.cmdn = { ...cmdn, members: this.commend.users }
            this.deleteCommendProp('users')
          }
        }
        this.deleteCommendProp('cmdn')
        this.cmdn.isClass = this.isClass
      },
      // 转换表彰对象数据（群成员全选则显示群组）
      toMembers() {
        let mbs = []
        let count = 0
        this.objData.caches.map(c => {
          count += c.members.length
          c.members.length !== c.total
            ? mbs.push(
                ...c.members.map(m => {
                  return {
                    avatar: m.avatar,
                    type: 'to',
                    userId: m.userId,
                    name: m.name,
                    groupId: m.groupId
                  }
                })
              )
            : mbs.push({
                type: 'to',
                userId: c.id,
                name: c.name,
                userType: c.groupType === '1' ? 'group' : 'class',
                groupId: c.groupId
              })
        })
        return { datas: mbs, count: count }
      },
      handleType() {
        this.setCommend({ cmdn: this.cmdn })
        this.routePush({ name: 'selectType1048' })
      },
      handleObject() {
        if (this.isClass) {
          this.setCommend({ cmdn: this.cmdn, users: this.cmdn.members })
          this.routePush({ name: 'selectMember1048', query: { type: '4' } })
        } else {
          this.setCommend({ cmdn: this.cmdn })
          this.routePush({ name: 'selectGroup1048' })
        }
      },
      handleTemplate() {
        const that = this

        let cmdn = that.cmdn
        if (!cmdn.type) {
          that.$message({ message: '请选择表彰类型', type: 'warning' })
          return false
        }
        if ((that.isClass && !Check.isRealArray(cmdn.members)) || (that.isSchool && !Check.isRealArray(that.objData.caches))) {
          that.$message({ message: '请选择表彰对象', type: 'warning' })
          return false
        }
        if (Check.isNullString(cmdn.content)) {
          that.$message({ message: '表彰內容不能为空', type: 'warning' })
          return false
        }

        let users = []
        let count = 0
        if (that.isClass) {
          users = cmdn.members
          count = cmdn.members.length
        } else {
          let mb = that.toMembers()
          users = mb.datas
          count = mb.count
        }

        let mbTxt = users
          .map(m => {
            return m.name
          })
          .join('、')
        if (that.singleMeta && that.singleMeta.obj === '1') {
          mbTxt = users[0].name
        }

        that.setCommend({
          cmdn: this.cmdn,
          view: {
            member: mbTxt.length > 18 ? `${mbTxt.substring(0, 18)}...` : mbTxt,
            date: DateUtils.format(new Date(), DateUtils.YMD),
            content: cmdn.content.length > 76 ? `${cmdn.content.substring(0, 76)}...` : cmdn.content,
            mCount: count,
            groupName: that.currentGroup.name
          }
        })
        that.routePush({ name: 'selectTemplate1048' })
      },
      commonality() {
        // 这是新建和草稿的公共部分,需要return出来
        const that = this
        let cmdn = that.cmdn
        if (!cmdn.type) {
          that.$message({ message: '请选择表彰类型', type: 'warning' })
          return false
        }
        if ((that.isClass && !Check.isRealArray(cmdn.members)) || (that.isSchool && !Check.isRealArray(that.objData.caches))) {
          that.$message({ message: '请选择表彰对象', type: 'warning' })
          return false
        }
        if (Check.isNullString(cmdn.content)) {
          that.$message({ message: '表彰內容不能为空', type: 'warning' })
          return false
        }
        if (!cmdn.template) {
          that.$message({ message: '表彰模板不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1048',
          groupId: that.currentGroup.groupId,
          categoryId: cmdn.type.id,
          categoryName: cmdn.type.name,
          msgJson: JSON.stringify({
            groupId: that.currentGroup.groupId,
            title: '表彰',
            groupName: that.currentGroup.name,
            groupNumber: that.currentGroup.id,
            groupType: that.currentGroup.type,
            logo: cmdn.template.logo
          }),
          content: cmdn.content
        })
        if (that.isClass) {
          postData.notifys = cmdn.members
            .map(v => {
              return v.userId
            })
            .join(',')
          postData.toUsers = cmdn.members.map(v => {
            return {
              avatar: v.avatar,
              type: 'to',
              userId: v.userId,
              name: v.name,
              groupId: v.groupId
            }
          })
          postData.extensionType = cmdn.members.length
        } else {
          let mb = that.toMembers()
          postData.notifys = mb.datas
            .map(m => {
              return m.userId
            })
            .join(',')
          postData.toUsers = mb.datas
          postData.extensionType = mb.count
        }
        return postData
      },
      handleSubmit() {
        const that = this
        // this.commonality()指代的就是postData数据，但如果检验return的是false，就需要判断有没有数据
        let postDatas = this.commonality()
        if (!postDatas) {
          return false
        }
        that.addMessage(postDatas).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      onDraft() {
        // 存草稿
        let postDatas = this.commonality()
        if (!postDatas) {
          return false
        }
        let postTemplate = {
          template: {
            groupId: this.groupId,
            appType: '1048',
            type: '2',
            userId: this.userId,
            message: {
              ...postDatas
            }
          }
        }
        Api.saveDraft(postTemplate).then(res => {
          this.$message({ type: 'success', message: '保存成功' })
          this.getTemplatesCount()
        })
      },
      onOptionalModule() {
        // 选择模板
        this.routePush({
          path: '/vx/group/business/10029/templates',
          query: {
            type: '1048'
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .commend-create {
    .cmd-desc {
      border-bottom: rem(1) solid #ebebeb;
      textarea {
        height: rem(120);
      }
    }
    .cmd-temp {
      width: rem(80);
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
    }
  }
  .category-title {
    &.template {
      @include templateBg;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
