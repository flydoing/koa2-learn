<template>
  <Page :title="title"
        closePrompt
        :hasSubmit="isCreate"
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <Avatar @success="handleAvatar">
      <Item label="头像">
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(form.avatar,'thumb'),error:Image.ICO_AVATAR}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <item label="名称"
          :remark="form.name"
          :hasClick="canEdit"
          @click="handleName">
    </item>
    <item label="相关学校"
          @click="handleSchool"
          :hasClick="canEdit"
          :remark="schoolTxt"></item>
    <item label="相关代理商"
          @click="handleAgent"
          :hasClick="canEdit"
          :remark="agentTxt"></item>
    <Item label="类型"
          :remark="typeTxt"
          :hasClick="canEdit"
          @click="handleType">
    </Item>
    <template v-if="canEdit">
      <el-popover placement="bottom-end"
                  width="400"
                  trigger="click"
                  v-model="showCategory">
        <Scroller :height="300">
          <Item v-for="(item, i) in categories"
                :key="i"
                @click="handleCategory(item)"
                :label="item.name">
          </Item>
        </Scroller>
        <Item slot="reference"
              label="类别"
              :remark="categoryTxt">
        </Item>
      </el-popover>
    </template>
    <template v-else>
      <Item label="类别"
            :hasClick="false"
            :remark="categoryTxt">
      </Item>
    </template>
    <template v-if="canEdit">
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
    </template>
    <template v-else>
      <item label="微信群"
            :hasClick="false"
            :remark="stateTxt"></item>
    </template>
    <item label="地址"
          @click="handleAddress"
          :hasClick="canEdit"
          :remark="addressTxt"></item>
    <item label="班级数量"
          @click="handleCount"
          :hasClick="canEdit"
          :remark="form.count">
    </item>
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
      <i slot="after"
         v-if="canEdit"
         class='ico ico-delete'
         @click.stop="handleRemoveContact(user, i)"></i>
    </ItemList>
    <item v-if="canEdit"
          @click="handleAddContact"
          label="添加"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <item label="客户经理"
          @click="handleCManager"
          :hasClick="canEdit"
          :remark="cManagerTxt"></item>
    <item label="线上产品经理"
          @click="handleOnManager"
          :hasClick="canEdit"
          :remark="onManagerTxt"></item>
    <item label="线下产品经理"
          @click="handleOffManager"
          :hasClick="canEdit"
          :remark="offManagerTxt"></item>
    <item label="相关人"
          @click="handleRelation"
          :remark="relationTxt"></item>
    <div class="category-title"></div>
    <template v-if="isCreate">
      <TextInput placeholder="备注内容"
                 max="200"
                 v-model="form.remark"></TextInput>
    </template>
    <template v-else>
      <item label="备注"
            @click="handleRemark"
            :remark="form.remark"></item>
    </template>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import Api1079 from '@/views/business/1079/api'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve),
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        form: {
          avatar: '', // 客户形象
          name: '',
          school: null, // 相关学校
          agent: null, // 代理商
          types: [], // 类型
          category: null, // 类别
          state: null, // 微信群创建状态
          address: null, // 地址
          count: '', // 班级数量
          contacts: [], // 联系人
          cManager: null, // 客户经理
          onManager: null, // 线上产品经理
          offManager: null, // 线下产品经理
          relations: [], // 相关人
          remark: ''
        },
        showCategory: false,
        categories: [],
        states: []
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
        return this.form.id ? '客户' : '新建客户'
      },
      isCreate() {
        return this.form.id === undefined || this.form.id === 0
      },
      canEdit() {
        return this.isCreate || this.admin || this.form.userId === this.userId
      },
      schoolTxt() {
        let school = this.form.school || {}
        return school.name || (this.isCreate ? '选填' : '')
      },
      agentTxt() {
        let agent = this.form.agent || {}
        return agent.name || (this.isCreate ? '选填' : '')
      },
      typeTxt() {
        let types = this.form.types
        if (Check.isRealArray(types)) {
          let tps = types.map(v => {
            return v.name
          })
          return tps.join('、')
        }
        return this.isCreate ? '必填' : ''
      },
      categoryTxt() {
        let category = this.form.category || {}
        return category.name || (this.isCreate ? '必填' : '')
      },
      stateTxt() {
        let state = this.form.state || {}
        return state.name || (this.isCreate ? '必填' : '')
      },
      addressTxt() {
        let ads = this.form.address
        if (ads) {
          return `${ads.province} ${ads.city}<br>${ads.address}`
        }
        return ''
      },
      cManagerTxt() {
        let cManager = this.form.cManager || {}
        return cManager.name || (this.isCreate ? '必填' : '')
      },
      onManagerTxt() {
        let onManager = this.form.onManager || {}
        return onManager.name || (this.isCreate ? '必填' : '')
      },
      offManagerTxt() {
        let offManager = this.form.offManager || {}
        return offManager.name || (this.isCreate ? '必填' : '')
      },
      relationTxt() {
        let relations = this.form.relations
        if (Check.isRealArray(relations)) {
          let users = relations.map(v => {
            return v.name
          })
          return users.join('、')
        }
        return this.isCreate ? '选填' : ''
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp', 'modifyChannelMessage']),
      fetchData() {
        let cid = this.routeQuery('cid')
        if (this.crm.params) {
          this.deleteCrmProp('params')
        }
        if (this.crm.relations) {
          this.deleteCrmProp('relations')
        }
        if (cid) {
          Api.getCustomerInfo(cid, this.groupId).then(res => {
            let form = { ...this.form }
            if (res.clients) {
              let client = res.clients[0]
              form.id = client.id
              form.groupId = client.groupId
              form.name = client.name
              form.avatar = client.logo
              form.remark = client.description
            }
            if (res.message) {
              form.userId = res.message.fromUserId
              form.msgId = res.message.id
            }
            if (res.metaDatas) {
              let types = []
              res.metaDatas.forEach(v => {
                if (v.metaType === 'm_client_school') {
                  form.school = { name: v.obj, id: v.userId }
                } else if (v.metaType === 'm_client_agent') {
                  form.agent = { name: v.obj, id: v.userId }
                } else if (v.metaType === 'm_class_num') {
                  form.count = v.obj
                } else if (v.metaType === 'm_client_address') {
                  form.address = JSON.parse(v.obj)
                } else if (v.metaType === 'm_category') {
                  types.push({ name: v.obj, id: v.userId })
                } else if (v.metaType === 'm_client_weixin_group') {
                  form.state = { name: v.obj, id: v.userId }
                } else if (v.metaType === 'm_client_stage') {
                  form.category = { name: v.obj, id: v.userId }
                }
              })
              form.types = types
            }
            if (res.contacts) {
              form.contacts = res.contacts
            }
            if (res.relations) {
              let relations = []
              res.relations.forEach(v => {
                if (v.type === '2') {
                  relations.push(v)
                } else if (v.type === '1') {
                  form.cManager = v
                } else if (v.type === '6') {
                  form.offManager = v
                } else if (v.type === '7') {
                  form.onManager = v
                }
              })
              form.relations = relations
            }
            this.form = form
          })
          this.deleteCrmProp('types')
          this.deleteCrmProp('form')
        } else if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          let school = this.getStorage('_crm_business_school_cache')
          this.form.school = school || this.form.school
          let agent = this.getStorage('_crm_business_agent_cache')
          this.form.agent = agent || this.form.agent
          let cManager = this.getStorage('_crm_business_cManager_cache')
          this.form.cManager = cManager || this.form.cManager
          let onManager = this.getStorage('_crm_business_onManager_cache')
          this.form.onManager = onManager || this.form.onManager
          let offManager = this.getStorage('_crm_business_offManager_cache')
          this.form.offManager = offManager || this.form.offManager
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
              this.form.contacts.push({ ...contact, id: new Date().getTime() })
            }
            this.deleteCrmProp('contact')
          }
          if (this.crm.address) {
            this.form.address = this.crm.address
            this.deleteCrmProp('address')
          }
          this.deleteCrmProp('form')
        }
        CategoryApi.getCategorysByType('217').then(res => {
          this.categories = res.categorys || []
          if (!this.form.state) {
            this.form.state = res.categorys[0]
          }
        })
        CategoryApi.getCategorysByType('218').then(res => {
          this.states = res.categorys || []
        })
      },
      modifyInfo(data, callback) {
        let msgId = this.form.msgId
        Api.modifyCustomer(
          {
            clients: [data.client],
            msgId: msgId
          },
          msgId
        ).then(res => {
          this.modifyChannelMessage(res.messages[0])
          GroupApi.addGroup({
            groups: [data.group]
          }).then(result => {
            this.$message({ message: '操作成功', type: 'success' })
            callback && callback(result)
          })
        })
      },
      modifyMeta(data, callback) {
        Api.modifyCustomer(
          {
            metaDatas: data
          },
          this.form.msgId
        ).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          callback && callback(res)
        })
      },
      modifyContacts(data, callback) {
        let form = this.form
        Api.modifyCustomer(
          {
            contacts: [{ ...data, clientId: form.id }],
            msgId: form.msgId
          },
          form.msgId
        ).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          callback && callback(res)
        })
      },
      modifyRelation(user, type, data, cback) {
        let form = this.form
        let relations = []
        if (user) {
          relations.push({
            id: user.id,
            groupId: form.groupId,
            status: 'd'
          })
        }

        GroupApi.addGroupRelation({
          relations: [
            ...relations,
            {
              groupId: form.groupId,
              userId: data.userId,
              type: type
            }
          ]
        }).then(res => {
          Api.modifyCustomer(
            {
              clients: [
                {
                  id: form.id
                }
              ]
            },
            form.msgId
          ).then(result => {
            this.modifyChannelMessage(result.messages[0])
            this.$message({ message: '操作成功', type: 'success' })
            cback && cback()
          })
        })
      },
      handleAvatar(file) {
        if (this.isCreate) {
          this.form.avatar = file.id
        } else {
          let form = this.form
          this.modifyInfo(
            {
              group: {
                id: form.id,
                logo: file.id
              },
              client: {
                id: form.id,
                parentId: this.currentGroup.id,
                logo: file.id
              }
            },
            () => {
              this.form.avatar = file.id
            }
          )
        }
      },
      handleName() {
        this.$prompt(' ', '名称', {
          inputValue: this.form.name,
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '名称不能为空', type: 'warning' })
            return false
          }
          if (this.isCreate) {
            this.form.name = value
          } else {
            let form = this.form
            this.modifyInfo(
              {
                group: {
                  id: form.id,
                  name: value
                },
                client: {
                  id: form.id,
                  parentId: this.currentGroup.id,
                  name: value
                }
              },
              () => {
                this.form.name = value
              }
            )
          }
        })
      },
      handleSchool() {
        const that = this
        let params = {
          property: 'school',
          getListData: function(callback) {
            GroupApi.getSchools(that.groupId).then(res => {
              callback(res.schools || [])
            })
          }
        }
        if (!this.isCreate) {
          params.callback = (data, cback) => {
            this.modifyMeta(
              [
                {
                  metaType: 'm_client_school',
                  extension: this.form.groupId,
                  obj: data.name,
                  userId: data.id
                }
              ],
              cback
            )
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '相关学校'
          }
        })
      },
      handleAgent() {
        const that = this
        let params = {
          property: 'agent',
          getListData: callback => {
            Api1079.getAgents(that.groupId).then(res => {
              callback(res.datas || [])
            })
          }
        }
        if (!this.isCreate) {
          params.callback = (data, cback) => {
            this.modifyMeta(
              [
                {
                  metaType: 'm_client_agent',
                  extension: this.form.groupId,
                  obj: data.name,
                  userId: data.id
                }
              ],
              cback
            )
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({
          path: '/vx/group/business/1046/selectList',
          query: {
            title: '相关代理商'
          }
        })
      },
      handleType() {
        this.setCrm({ form: this.form, types: this.form.types, canEdit: this.canEdit })
        this.routePush({
          path: '/vx/group/business/1062/selectType'
        })
      },
      handleCategory(item) {
        if (this.isCreate) {
          this.showCategory = false
          this.form.category = item
        } else {
          this.modifyMeta(
            [
              {
                metaType: 'm_client_stage',
                extension: this.form.groupId,
                obj: item.name,
                userId: item.id
              }
            ],
            () => {
              this.showCategory = false
              this.form.category = item
            }
          )
        }
      },
      handleState(item) {
        if (this.isCreate) {
          this.form.state = item
        } else {
          this.modifyMeta(
            [
              {
                metaType: 'm_client_weixin_group',
                extension: this.form.groupId,
                obj: item.name,
                userId: item.id
              }
            ],
            () => {
              this.form.state = item
            }
          )
        }
      },
      handleCount() {
        this.$prompt(' ', '班级数量', {
          inputValue: this.form.count,
          inputPlaceholder: '输入数量',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '班级数量不能为空', type: 'warning' })
            return false
          }
          if (!Check.isNumber(value) || value < 1) {
            this.$message({ message: '请输入正确的数值', type: 'warning' })
            return false
          }
          if (this.isCreate) {
            this.form.count = value
          } else {
            this.modifyMeta(
              [
                {
                  metaType: 'm_class_num',
                  extension: this.form.groupId,
                  obj: value
                }
              ],
              () => {
                this.form.count = value
              }
            )
          }
        })
      },
      handleAddress() {
        let options = {
          form: this.form,
          address: this.form.address
        }
        if (!this.isCreate) {
          options.params = {
            callback: (data, cback) => {
              this.modifyMeta(
                [
                  {
                    metaType: 'm_client_address',
                    extension: this.form.groupId,
                    obj: JSON.stringify({
                      province: data.province,
                      city: data.city || '',
                      address: data.title,
                      district: data.district,
                      longtitude: data.point.lng,
                      latitude: data.point.lat
                    })
                  }
                ],
                () => {
                  cback && cback()
                }
              )
            }
          }
        }
        this.setCrm(options)
        this.routePush({ path: '/vx/group/business/1046/selectAddress' })
      },
      handleCManager() {
        let params = {
          property: 'cManager',
          users: this.form.cManager ? [this.form.cManager] : []
        }
        if (!this.isCreate) {
          params.callback = (data, cback) => {
            this.modifyRelation(this.form.cManager, '1', data, cback)
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleOnManager() {
        let params = {
          property: 'onManager',
          users: this.form.onManager ? [this.form.onManager] : []
        }
        if (!this.isCreate) {
          params.callback = (data, cback) => {
            this.modifyRelation(this.form.onManager, '7', data, cback)
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleOffManager() {
        let params = {
          property: 'offManager',
          users: this.form.offManager ? [this.form.offManager] : []
        }
        if (!this.isCreate) {
          params.callback = (data, cback) => {
            this.modifyRelation(this.form.offManager, '6', data, cback)
          }
        }
        this.setCrm({ form: this.form, params: params })
        this.routePush({ path: '/vx/group/business/1046/selectMember' })
      },
      handleRelation() {
        if (this.isCreate) {
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
          this.setCrm({ form: this.form, canEdit: this.canEdit, relations: this.form.relations })
          this.routePush({ path: '/vx/group/business/1062/addMember' })
        }
      },
      handleContact(user) {
        let options = {
          form: this.form,
          contact: user,
          canEdit: this.canEdit
        }
        if (!this.isCreate) {
          options.params = {
            callback: (data, cback) => {
              this.modifyContacts(data, () => {
                cback && cback()
              })
            }
          }
        }
        this.setCrm(options)
        this.routePush({ path: '/vx/group/business/1046/contactEdit' })
      },
      handleAddContact() {
        let options = {
          form: this.form,
          canEdit: true
        }
        if (!this.isCreate) {
          options.params = {
            callback: (data, cback) => {
              this.modifyContacts(data, () => {
                cback && cback()
              })
            }
          }
        }
        this.setCrm(options)
        this.routePush({ path: '/vx/group/business/1046/contactEdit' })
      },
      handleRemoveContact(data, i) {
        if (!this.isCreate) {
          this.$confirm('确认删除该联系人', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.modifyContacts({ ...data, status: 'd' }, () => {
              this.form.contacts.splice(i, 1)
            })
          })
        } else {
          this.form.contacts.splice(i, 1)
        }
      },
      handleRemark() {
        this.setCrm({ form: this.form, canEdit: this.canEdit })
        this.routePush({ path: '/vx/group/business/1062/remarkEdit' })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.types)) {
          that.$message({ message: '类型不能为空', type: 'warning' })
          return false
        }
        if (!form.category) {
          that.$message({ message: '类别不能为空', type: 'warning' })
          return false
        }
        if (!form.address) {
          that.$message({ message: '地址不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.count)) {
          that.$message({ message: '班级数量不能为空', type: 'warning' })
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

        let d = {
          clients: [
            {
              parentId: this.currentGroup.id,
              name: form.name,
              logo: form.avatar,
              description: form.remark
            }
          ],
          relations: [
            {
              userId: this.userId,
              type: '2'
            }
          ],
          metaDatas: [
            {
              metaType: 'm_class_num',
              obj: form.count
            }
          ],
          contacts: form.contacts.map(v => {
            return { ...v, id: void 0 }
          })
        }

        if (form.agent) {
          d.metaDatas.push({
            metaType: 'm_client_agent',
            obj: form.agent.name,
            userId: form.agent.id
          })
        }
        if (form.school) {
          d.metaDatas.push({
            metaType: 'm_client_school',
            obj: form.school.name,
            userId: form.school.id
          })
        }
        if (form.state) {
          d.metaDatas.push({
            metaType: 'm_client_weixin_group',
            obj: form.state.name,
            userId: form.state.id
          })
        }
        let ads = form.address
        d.metaDatas.push({
          metaType: 'm_client_address',
          obj: JSON.stringify({
            province: ads.province,
            city: ads.city || ads.province,
            address: ads.address,
            title: ads.title,
            district: ads.district || '',
            longtitude: ads.point.lng,
            latitude: ads.point.lat
          })
        })
        d.metaDatas.push({
          metaType: 'm_client_stage',
          obj: form.category.name,
          userId: form.category.id
        })
        form.types.forEach(v => {
          d.metaDatas.push({
            metaType: 'm_category',
            obj: v.name,
            userId: v.id
          })
        })

        d.relations.push(
          {
            userId: form.cManager.userId,
            type: '1'
          },
          {
            userId: form.offManager.userId,
            type: '6'
          },
          {
            userId: form.onManager.userId,
            type: '7'
          }
        )

        if (Check.isRealArray(form.relations)) {
          form.relations.forEach(v => {
            if (v.userId !== this.userId) {
              d.relations.push({ userId: v.userId, type: '2' })
            }
          })
        }

        Api.addCustomer(d).then(res => {
          that.modifyChannelMessage(res.messages[0])
          that.deleteCrmProp('form')
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        if (this.isCreate) {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.deleteCrmProp('form')
            this.routeBack()
          })
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
