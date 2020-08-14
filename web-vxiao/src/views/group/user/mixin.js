/**
 * 用户公用处理逻辑
 */
import Api from '@/api/group'
import Check from '@/utils/check'
import R from '@/views/group/mixin'
import MetaData from '@/constant/metaData'
export default {
  mixins: [R],
  data() {
    return {
      r: {}
    }
  },
  computed: {
    publicMeta() {
      if (Check.isRealArray(this.r.metaDatas)) {
        return this.r.metaDatas.filter(v => {
          return v.metaType === MetaData.SHOW_MOBILE
        })[0]
      }
      return null
    },
    showSwitch() {
      return this.isAdmin || this.userId === this.r.userId
    },
    isSwitched() {
      return this.publicMeta ? this.publicMeta.obj === 'true' : false
    },
    showMobile() {
      return this.showSwitch || (this.publicMeta && this.publicMeta.obj === 'true')
    },
    isSelf() {
      return this.userId === this.r.userId
    }
  },
  methods: {
    onLogo(file) {
      let that = this
      Api.addGroupRelation({
        relations: [
          {
            id: this.r.id,
            avatar: file.id,
            groupId: this.routeQuery('groupId') || this.currentGroup.groupId,
            userId: this.r.userId
          }
        ]
      }).then(res => {
        if (Check.isRealArray(res.relations)) {
          res.relations.forEach(relation => {
            that.modifyRelation(relation)
            that.r = { ...that.r, ...relation }
          })
          that.$message({ type: 'success', message: '修改成功' })
        }
      })
    },
    onFace(file) {
      let that = this
      Api.modifyFace({
        detects: [
          {
            face: file.id,
            userId: this.r.userId
          }
        ]
      }).then(res => {
        that.r = { ...that.r, face: file.id }
        that.$message({ type: 'success', message: '修改成功' })
      })
    },
    onPublic() {
      let meta = this.publicMeta
      if (meta) {
        meta.obj = meta.obj === 'true' ? 'false' : 'true'
      } else {
        meta = {
          metaType: 'm_show_mobile',
          userId: this.r.userId,
          extension: this.r.groupId,
          obj: 'true'
        }
      }
      Api.modifyGroupUser({
        id: this.r.id,
        groupId: this.r.groupId,
        userId: this.r.userId,
        metaDatas: [meta]
      }).then(res => {
        if (this.publicMeta) {
          this.r.metaDatas = this.r.metaDatas.map(v => {
            if (v.id === this.publicMeta.id) {
              v = res.relation.metaDatas[0]
            }
            return v
          })
        } else {
          if (this.r.metaDatas) {
            this.r.metaDatas.push(res.relation.metaDatas[0])
          } else {
            this.r.metaDatas = [res.relation.metaDatas[0]]
          }
        }
        this.$message({ type: 'success', message: '修改成功' })
      })
    },
    modifyName(type) {
      let that = this
      let u = {
        id: that.r.id,
        groupId: that.routeQuery('groupId') || that.currentGroup.groupId,
        userId: that.r.userId
      }
      that
        .$prompt(' ', '修改', {
          inputPlaceholder: '请输入',
          inputValue: that.r.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          u.name = value
          Api.addGroupRelation({
            relations: [u]
          }).then(res => {
            if (Check.isRealArray(res.relations)) {
              res.relations.forEach(relation => {
                that.modifyRelation(relation)
                that.r = { ...that.r, ...relation }
              })
              that.$message({ type: 'success', message: '修改成功' })
            }
          })
        })
        .catch(() => {})
    },
    modifyMobile() {
      let that = this
      let u = {
        id: that.r.id,
        groupId: that.routeQuery('groupId') || that.currentGroup.groupId,
        userId: that.r.userId
      }
      that
        .$prompt(' ', '修改', {
          inputPlaceholder: '请输入',
          inputValue: that.r.mobile,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          u.mobile = value
          Api.modifyGroupUser(u).then(res => {
            if (res.relation) {
              that.r = { ...that.r, ...res.relation }
              that.$message({ type: 'success', message: '修改成功' })
            }
          })
        })
        .catch(() => {})
    },
    onShare() {
      this.routePush({
        path: '/vx/group/user/shareList',
        query: {
          userId: this.r.userId
        }
      })
    },
    im() {
      this.routePushModel({
        path: '/vx/im',
        query: {
          userId: this.r.userId
        }
      })
    }
  },
  watch: {}
}
