<template>
  <page :title="form.name"
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="result-edit">
      <item :hasClick="false">
        <div slot="main">结果</div>
        <div slot="remark">
          <span @click="hanleResult('1')">
            <i class="ico ico-select"
               :class="{'active':form.result === '1'}"></i><label>正常</label>
          </span>
          &#12288;
          <span @click="hanleResult('2')">
            <i class="ico ico-select"
               :class="{'active':form.result === '2'}"></i><label>异常</label>
          </span>
        </div>
      </item>
      <item @click="handleClass">
        <div slot="main">相关班级</div>
        <div slot="remark"
             v-html="clsTxt"></div>
      </item>
      <item @click="handleMember">
        <div slot="main">相关成员</div>
        <div slot="remark"
             v-html="memberTxt"></div>
      </item>
      <TextInput placeholder="内容"
                 v-model="form.content"></TextInput>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          result: '1',
          content: '',
          classes: [],
          members: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        inspection: 'getInspection'
      }),
      clsTxt() {
        let cs = this.form.classes
        return cs.length > 0
          ? cs
              .map(v => {
                return v.name
              })
              .join('、')
          : '选填'
      },
      memberTxt() {
        let mbs = this.form.members
        return mbs.length > 0 ? `${mbs.length}人` : '选填'
      }
    },
    methods: {
      ...mapActions(['setInspection']),
      prop(isClass) {
        let item = this.inspection.item
        if (item.remark && Check.isRealArray(item.remark.toUsers)) {
          return item.remark.toUsers.filter(v => {
            if (isClass) {
              return v.type !== 'creator' && v.userType === 'class'
            } else {
              return v.type !== 'creator' && v.userType !== 'class'
            }
          })
        }
        return []
      },
      fetchData() {
        if (this.inspection.form) {
          this.form = JSON.parse(JSON.stringify(this.inspection.form))
          if (this.inspection.users) {
            this.form.members = this.inspection.users
          }
          if (this.inspection.classes) {
            this.form.classes = this.inspection.classes
          }
        } else if (this.inspection.item) {
          let content = ''
          let item = this.inspection.item
          if (Check.isObject(item.remark)) {
            content = item.remark.content
          }

          let cs = this.prop(true)
          if (Check.isRealArray(cs)) {
            cs = cs.map(v => {
              return { id: v.userId, name: v.name }
            })
          }

          let us = this.prop(false)
          if (Check.isRealArray(us)) {
            us = us.map(v => {
              return { userId: v.userId, name: v.name, avatar: v.avatar }
            })
          }

          this.form = {
            name: item.itemName,
            result: item.result,
            content: content,
            classes: cs,
            members: us
          }
        }
      },
      hanleResult(value) {
        this.form.result = value
      },
      handleClass() {
        this.setInspection({ form: this.form, classes: this.form.classes, users: this.form.members })
        this.routePush({ name: 'selectClass1216' })
      },
      handleMember() {
        this.setInspection({ form: this.form, users: this.form.members, classes: this.form.classes })
        this.routePush({ name: 'memberList1216' })
      },
      matchData(datas, values, property) {
        let arr = []
        let dMap = new Map()
        datas.forEach((v, i) => {
          dMap.set(v.userId, v)
        })

        let vMap = new Map()
        values.forEach((v, i) => {
          vMap.set(v[property], v)
        })

        datas.forEach((v, i) => {
          if (!vMap.get(v.userId)) {
            arr.push({ ...v, status: 'd' })
          } else {
            arr.push(v)
          }
        })

        values.forEach((v, i) => {
          if (!dMap.get(v[property])) {
            arr.push({
              userId: v[property],
              name: v.name,
              avatar: v.avatar || '',
              userType: v.userType || 'class'
            })
          }
        })
        return arr
      },
      handleSubmit() {
        const that = this
        let form = that.form
        let item = that.inspection.item
        if (Check.isObject(item.remark)) {
          let users = that.matchData(this.prop(false), form.members, 'userId')
          let classes = that.matchData(this.prop(true), form.classes, 'id')
          item = {
            ...item,
            result: form.result,
            remark: {
              ...item.remark,
              toUsers: [...users, ...classes],
              content: form.content
            }
          }
        } else {
          let users = that.matchData([], form.members, 'userId')
          let classes = that.matchData([], form.classes, 'id')
          item = {
            ...item,
            result: form.result,
            remark: that.constructionMessage({
              type: '121602',
              groupId: that.currentGroup.groupId,
              categoryId: item.itemId,
              toUsers: [...users, ...classes],
              content: form.content
            })
          }
        }
        this.setInspection({ item: item, form: null, users: [], classes: [] })
        this.routeBack()
      },
      handleBack() {
        this.setInspection({ form: null, users: [], classes: [] })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-item {
    i,
    label {
      vertical-align: middle;
      cursor: pointer;
    }
  }
</style>
