<template>
  <Page :title="title"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <div class="agent-create">
      <item label="名称"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleSource">
        <div class="el-dropdown-link">
          <item label="来源"
                :remark="sourceTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(scource,i) in sources"
                            :key="i"
                            :command="scource">{{scource.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleProgress">
        <div class="el-dropdown-link">
          <item label="进展"
                :remark="progressTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(progress,i) in progresses"
                            :key="i"
                            :command="progress">{{progress.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleState">
        <div class="el-dropdown-link">
          <item label="微信群"
                :remark="stateTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(state,i) in states"
                            :key="i"
                            :command="state">{{state.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item label="学校资源数量"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.count" />
        <div slot="after">所</div>
      </item>
      <item label="人员规模"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.scale" />
      </item>
      <item label="年销售（万元）"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.amount" />
      </item>
      <item label="区域地位"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.status" />
      </item>
      <item label="主营产品/品牌"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.brand" />
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleIntention">
        <div class="el-dropdown-link">
          <item label="合作意向"
                :remark="intentionTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(intention,i) in intentions"
                            :key="i"
                            :command="intention">{{intention.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item label="手机/电话"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.mobile" />
      </item>
      <item label="电子邮件"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.email" />
      </item>
      <item label="所在地"
            :hasClick="false">
        <div slot="remark">
          <el-cascader class="es-address"
                       :options="form.provinces"
                       v-model="form.location"
                       @active-item-change="handleLocation"></el-cascader>
        </div>
      </item>
      <item label="地址"
            :hasClick="false">
        <input slot="remark"
               placeholder="选填"
               v-model="form.address" /></item>
      <TextInput placeholder="简介（选填）"
                 :max="100"
                 v-model="form.synopsis"></TextInput>
      <div class="category-title text">联系人</div>
      <ItemList v-for="(user, i) in contacts"
                :key="i"
                @click="handleContact(user)">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:url(user.avatar),error:Image.ICO_AVATAR}">
        <span slot="title">{{user.name}}</span>
        <span slot="main">{{user.mobile}}</span>
        <span slot="remark">{{user.job}}</span>
        <i slot="after"
           class='ico ico-delete'
           @click.stop="handleRemoveContact(user, i)"></i>
      </ItemList>
      <item @click="handleAddContact"
            label="添加"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
      </item>
      <div class="category-title"></div>
      <item label="客户经理"
            @click="handleCManager"
            :remark="cManagerTxt"></item>
      <item label="线上产品经理"
            @click="handleOnManager"
            :remark="onManagerTxt"></item>
      <item label="线下产品经理"
            @click="handleOffManager"
            :remark="offManagerTxt"></item>
      <item label="相关人"
            @click="handleRelation"
            :remark="relationTxt"></item>
    </div>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          source: null, // 来源
          progress: null, // 合作进展
          state: null, // 微信群状态
          count: '', // 学校资源数量
          scale: '', // 人员规模
          amount: '', // 年销售（万元）
          status: '', // 区域地位
          brand: '', // 主营产品/品牌
          intention: null, // 合作意向
          mobile: '', // 手机/电话
          email: '', // 电子邮件
          location: [], // 所在地
          address: '', // 地址
          synopsis: '', // 简介
          contacts: [], // 联系人
          cManager: null, // 客户经理
          onManager: null, // 线上产品经理
          offManager: null, // 线下产品经理
          relations: [], // 相关人,
          area: {},
          provinces: []
        },
        sources: [],
        progresses: [],
        states: [],
        intentions: [],
        removeUsers: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        return this.form.id ? '代理商' : '新建代理商'
      },
      isEdit() {
        return this.form.id !== undefined && this.form.id !== 0
      },
      sourceTxt() {
        let source = this.form.source || {}
        return source.name || ''
      },
      progressTxt() {
        let progress = this.form.progress || {}
        return progress.name || ''
      },
      intentionTxt() {
        let intention = this.form.intention || {}
        return intention.name || ''
      },
      stateTxt() {
        let state = this.form.state || {}
        return state.name || '必填'
      },
      cManagerTxt() {
        let cManager = this.form.cManager || {}
        return cManager.name || '必填'
      },
      onManagerTxt() {
        let onManager = this.form.onManager || {}
        return onManager.name || '必填'
      },
      offManagerTxt() {
        let offManager = this.form.offManager || {}
        return offManager.name || '必填'
      },
      contacts() {
        let cts = this.form.contacts.filter(v => {
          return v.status !== 'd'
        })
        return cts
      },
      relationTxt() {
        let relations = this.form.relations.filter(v => {
          return v.status !== 'd'
        })
        if (Check.isRealArray(relations)) {
          let users = relations.map(v => {
            return v.name
          })
          return users.join('、')
        }
        return '选填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyChannelMessage', 'modifyMessage']),
      fetchData() {
        const that = this
        let aid = this.routeQuery('aid')
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let cust = this.getStorage('_crm_business_cManager_cache')
          if (cust && this.isEdit) {
            let user = this.form.cManager || {}
            if (cust.userId !== user.userId) {
              if (user.msgId) {
                this.form.removeUsers.push(user)
              }
              this.form.cManager = { ...cust, extension: '1' }
            }
          } else if (cust) {
            this.form.cManager = { ...cust, extension: '1' }
          }
          let on = this.getStorage('_crm_business_onManager_cache')
          if (on && this.isEdit) {
            let user = this.form.onManager || {}
            if (on.userId !== user.userId) {
              if (user.msgId) {
                this.form.removeUsers.push(user)
              }
              this.form.onManager = { ...on, extension: '2' }
            }
          } else if (on) {
            this.form.onManager = { ...on, extension: '2' }
          }
          let off = this.getStorage('_crm_business_offManager_cache')
          if (off && this.isEdit) {
            let user = this.form.offManager || {}
            if (off.userId !== user.userId) {
              if (user.msgId) {
                this.form.removeUsers.push(user)
              }
              this.form.offManager = { ...off, extension: '3' }
            }
          } else if (off) {
            this.form.offManager = { ...off, extension: '3' }
          }
          let relations = this.getStorage('_crm_business_relations_cache')
          this.form.relations = relations || this.form.relations
          if (this.crm.types) {
            this.form.types = this.crm.types
            this.deleteCrmProp('types')
          }
          let contact = this.crm.contact
          if (contact) {
            if (contact.id) {
              this.form.contacts.map(v => {
                if (v.id === contact.id) {
                  return contact
                }
                return v
              })
            } else {
              this.form.contacts.push(contact)
            }
            this.deleteCrmProp('contact')
          }
          this.deleteCrmProp('form')
        } else if (aid) {
          MessageApi.getMessageById(aid).then(res => {
            if (res.message) {
              let m = res.message
              let mJson = JSON.parse(m.msgJson || '{}').user || {}
              this.form = {
                ...this.form,
                id: m.id || void 0,
                userId: m.fromUserId,
                name: mJson.name,
                address: mJson.address || '',
                count: mJson.resourceNum || '', // 学校资源数量
                scale: mJson.companySize || '', // 人员规模
                amount: mJson.salesAmount || '', // 年销售（万元）
                status: mJson.region || '', // 区域地位
                brand: mJson.majorProduct || '', // 主营产品/品牌
                mobile: mJson.mobile || '', // 手机/电话
                email: mJson.email || '', // 电子邮件
                synopsis: mJson.introduce || '' // 简介
              }
              if (mJson.sourceType) {
                this.form.source = { name: mJson.sourceType }
              }
              if (mJson.coopProgress) {
                this.form.progress = { name: mJson.coopProgress }
              }
              if (mJson.weChatGroupJoined) {
                this.form.state = { name: mJson.weChatGroupJoined }
              }
              if (mJson.levelName) {
                this.form.intention = { name: mJson.levelName }
              }
              if (mJson.contacts) {
                this.form.contacts = mJson.contacts
              }

              let location = []
              if (mJson.provinceId) {
                location.push(mJson.provinceId)
                let p = {
                  province: mJson.province,
                  provinceId: mJson.provinceId,
                  label: mJson.province,
                  value: mJson.provinceId
                }
                let c = null
                if (mJson.cityId) {
                  location.push(mJson.cityId)
                  c = {
                    city: mJson.city,
                    cityId: mJson.cityId,
                    label: mJson.city,
                    value: mJson.cityId
                  }
                }
                let a = null
                if (mJson.areaId) {
                  location.push(mJson.areaId)
                  a = {
                    area: mJson.area,
                    areaId: mJson.areaId,
                    label: mJson.area,
                    value: mJson.areaId
                  }
                }
                if (c && a) {
                  c.children = [a]
                  p.children = [c]
                  this.form.area[a.areaId] = a
                  this.form.area[c.areaId] = c
                } else if (c) {
                  p.children = [c]
                }
                if (Check.isRealArray(this.provinces)) {
                  this.provinces = this.provinces.map(v => {
                    if (v.provinceId === p.provinceId) {
                      return p
                    }
                    return v
                  })
                } else {
                  this.provinces = [p]
                }
                this.form.area[p.provinceId] = p
                this.form.location = location
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
        CategoryApi.getCategorysByType('210').then(res => {
          this.sources = res.categorys || []
        })
        CategoryApi.getCategorysByType('211').then(res => {
          this.progresses = res.categorys || []
        })
        CategoryApi.getCategorysByType('218').then(res => {
          this.states = res.categorys || []
          if (!this.form.state) {
            this.form.state = res.categorys[0]
          }
        })
        CategoryApi.getCategorysByType('169').then(res => {
          this.intentions = res.categorys || []
        })
        GroupApi.getProvinces().then(res => {
          that.form.provinces = res.provinces.map(v => {
            if (that.form.area[v.provinceId]) {
              return that.form.area[v.provinceId]
            }
            if (v.province.indexOf('市') !== -1) {
              v = { ...v, label: v.province, value: v.provinceId }
              that.form.area[v.provinceId] = v
            } else {
              v = { ...v, label: v.province, value: v.provinceId, children: [] }
              that.form.area[v.provinceId] = v
            }
            return v
          })
        })
      },
      handleSource(item) {
        this.form.source = item
      },
      handleProgress(item) {
        this.form.progress = item
      },
      handleIntention(item) {
        this.form.intention = item
      },
      handleState(item) {
        this.form.state = item
      },
      handleLocation(ads) {
        const that = this
        let pv = that.form.area[ads[0]]
        let ct = that.form.area[ads[1]]
        if (ct && ads[1]) {
          GroupApi.getAreas(ads[1]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === ct.parentId) {
                v.children = v.children.map(c => {
                  if (c.value === parseInt(ads[1]) && res.areas) {
                    c.children = res.areas.map(a => {
                      a = { ...a, label: a.area, value: a.areaId }
                      that.form.area[a.areaId] = a
                      return a
                    })
                  }
                  return c
                })
              }
              return v
            })
          })
        } else {
          GroupApi.getCities(ads[0]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === parseInt(ads[0]) && res.citys) {
                v.children = res.citys.map(c => {
                  c = { ...c, label: c.city, value: c.cityId, children: [] }
                  that.form.area[c.cityId] = c
                  return c
                })
                pv.children = v.children
              }
              return v
            })
          })
        }
        that.form.location = ads
      },
      handleCManager() {
        this.setCrm({
          form: this.form,
          params: {
            property: 'cManager',
            users: this.form.cManager ? [this.form.cManager] : []
          }
        })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleOnManager() {
        this.setCrm({
          form: this.form,
          params: {
            property: 'onManager',
            users: this.form.onManager ? [this.form.onManager] : []
          }
        })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleOffManager() {
        this.setCrm({
          form: this.form,
          params: {
            property: 'offManager',
            users: this.form.offManager ? [this.form.offManager] : []
          }
        })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleRelation() {
        if (!this.isEdit) {
          this.setCrm({
            form: this.form,
            params: {
              multiple: true,
              users: this.form.relations,
              property: 'relations'
            }
          })
          this.routePush({ path: '/vx/group/business/1046/selectMember' })
        } else {
          this.setCrm({ form: this.form, canEdit: true, relations: this.form.relations })
          this.routePush({ path: '/vx/group/business/1079/addMember' })
        }
      },
      handleContact(user) {
        this.setCrm({ form: this.form, contact: user, canEdit: true })
        this.routePush({ path: '/vx/group/business/1046/contactEdit' })
      },
      handleAddContact() {
        this.setCrm({ form: this.form, canEdit: true })
        this.routePush({ path: '/vx/group/business/1046/contactEdit' })
      },
      handleRemoveContact(data, i) {
        if (data.id) {
          this.$set(this.form.contacts, i, { ...data, status: 'd' })
        } else {
          this.form.contacts.splice(i, 1)
        }
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }
        if (!form.source) {
          that.$message({ message: '来源不能为空', type: 'warning' })
          return false
        }
        if (!form.progress) {
          that.$message({ message: '合作进展不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.location)) {
          that.$message({ message: '请选择所在地', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.count)) {
          that.$message({ message: '学校资源数量不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.contacts)) {
          that.$message({ message: '联系人不能为空', type: 'warning' })
          return false
        }
        if (!form.cManager) {
          that.$message({ message: '客户经理不能为空', type: 'warning' })
          return false
        }
        if (!form.onManager) {
          that.$message({ message: '线上产品经理不能为空', type: 'warning' })
          return false
        }
        if (!form.offManager) {
          that.$message({ message: '线下产品经理不能为空', type: 'warning' })
          return false
        }

        let province = form.area[form.location[0]]
        let city = form.area[form.location[1]]
        let mJson = {
          user: {
            address: form.address,
            contacts: form.contacts,
            email: form.email,
            introduce: form.synopsis,
            mobile: form.mobile,
            name: form.name,
            sourceType: form.source.name,
            coopProgress: form.progress.name,
            weChatGroupJoined: form.state.name,
            resourceNum: form.count,
            companySize: form.scale,
            salesAmount: form.amount,
            region: form.status,
            majorProduct: form.brand,
            provinceId: province.value,
            province: province.label,
            cityId: city.value,
            city: city.label
          }
        }

        if (form.intention) {
          mJson.user.levelId = form.intention.id
          mJson.user.levelName = form.intention.name
        }

        let postData = null
        if (!this.isEdit) {
          let toUsers = [
            {
              type: 'cc',
              userId: this.userId,
              name: this.userInfo.name,
              userType: this.userInfo.userType,
              avatar: this.userInfo.avatar
            },
            ...[form.cManager, form.onManager, form.offManager].map(v => {
              return {
                type: 'to',
                userId: v.userId,
                name: v.name,
                userType: v.userType,
                avatar: v.avatar,
                extension: v.extension
              }
            })
          ]
          if (Check.isRealArray(form.relations)) {
            form.relations.forEach(v => {
              toUsers.push({
                type: 'cc',
                userId: v.userId,
                name: v.name,
                userType: v.userType,
                avatar: v.avatar
              })
            })
          }
          postData = this.constructionMessage({
            ...this.editorMessage,
            groupId: this.groupId,
            type: '1079',
            msgJson: JSON.stringify(mJson),
            toUsers: toUsers,
            extension: this.routeQuery('binMsgId') || void 0
          })
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.deleteCrmProp('form')
            that.routeBack()
          })
        } else {
          let toUsers = [form.cManager, form.onManager, form.offManager].filter(v => {
            if (v.msgId === undefined) {
              v = {
                type: 'to',
                userId: v.userId,
                name: v.name,
                userType: v.userType,
                avatar: v.avatar,
                extension: v.extension
              }
            }
            return v.msgId === undefined
          })
          if (Check.isRealArray(form.removeUsers)) {
            form.removeUsers.forEach(v => {
              toUsers.push({ ...v, status: 'd' })
            })
          }
          let relations = form.relations.filter(v => {
            return v.status === 'd' || v.status === undefined
          })
          relations.forEach(v => {
            toUsers.push({
              id: v.id || void 0,
              type: 'cc',
              userId: v.userId,
              name: v.name,
              userType: v.userType,
              avatar: v.avatar,
              status: v.status || '1'
            })
          })
          postData = {
            id: form.id,
            groupId: this.groupId,
            msgJson: JSON.stringify(mJson),
            type: '1079'
          }
          if (Check.isRealArray(toUsers)) {
            postData.toUsers = toUsers
          }
          this.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.deleteCrmProp('form')
            that.routeBack()
          })
        }
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteCrmProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .agent-create {
    .vx-item {
      .es-address {
        line-height: rem(45) !important;
        .el-cascader__label {
          text-align: right !important;
          padding-right: 0;
        }
        .el-input__suffix {
          display: none;
        }
      }
      .el-input input {
        padding-right: 0;
      }
    }

    .es-time input {
      min-width: initial !important;
    }
  }
</style>
