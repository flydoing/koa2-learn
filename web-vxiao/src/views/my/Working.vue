<template>
  <Page title="工作状态">
    <div class="category-title text">当前状态</div>
    <Item :hasClick="false"
          :label="self.userState.state"
          :remark="self.userState | time">
    </item>
    <div class="category-title"></div>
    <el-dropdown class="block-element"
                 trigger="click"
                 v-for="(w,i) in works"
                 @command="handleSelectTime"
                 :key="i">
      <div class="el-dropdown-link">
        <Item @click="handleState(w.name)"
              :label="w.name">
          <template v-if="w.groupId">
            <div slot="remark"
                 @click.stop="handleEdit(w)">编辑</div>
            <i slot="after"
               class="ico ico-delete"
               @click.stop="handleRemove(w, i)"></i>
          </template>
        </Item>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="slot"
                          v-for="(slot, i) in slots"
                          :key="i">{{slot}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title"></div>
    <Item @click="handleAdd"
          :hasArrow="false"
          label="新增">
      <div slot="before"><i class='ico ico-plus'></i></div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import ApiUser from '@/api/user'
  import { mapGetters } from 'vuex'
  import DateFormat from '@/utils/date'
  export default {
    computed: {
      ...mapGetters({
        self: 'getUserDetail'
      }),
      r() {
        let txt = ''
        if (self && self.userState) {
          let beginTime = DateFormat.converFormat(new Date(self.userState.beginTime || ''))
          let endTime = DateFormat.converFormat(new Date(self.userState.endTime || ''))
          txt = `${beginTime}-${endTime}`
        }
        return txt
      }
    },
    data() {
      return {
        works: [],
        state: '',
        slots: [],
        curSlot: '0.5小时',
        userState: {
          beginTime: '',
          endTime: '',
          state: '',
          value: ''
        },
        categoryName: ''
      }
    },
    filters: {
      time(v) {
        if (v.beginTime && v.endTime) {
          return `${DateFormat.format(v.beginTime, 'MM-dd hh:mm')}-${DateFormat.format(v.endTime, 'MM-dd hh:mm')}`
        }
        return ''
      }
    },
    created() {
      let refresh = this.getStorage('_state_refresh')
      if (refresh) {
        this.getUserDetail()
      }

      let i = 0
      while (i <= 6) {
        i += 0.5
        this.slots.push(`${i.toFixed(1)}小时`)
      }
      this.slots.push('自定义')

      Api.loadWorks(this.USER.id).then(res => {
        this.works = res.categorys
      })
    },
    methods: {
      handleState(state) {
        this.state = state
      },
      handleSelectTime(command) {
        if (command !== '自定义') {
          this.curSlot = command
          let duration = (+this.curSlot.replace('小时', '') / 0.5) * 30
          ApiUser.modifyUser({
            id: this.USER.id,
            userState: {
              state: this.state,
              duration: duration
            }
          }).then(res => {
            this.getUserDetail()
            this.$message({ type: 'success', message: '修改成功' })
          })
        } else {
          this.routePush({
            path: '/vx/user/customTime',
            query: {
              state: this.state
            }
          })
        }
      },
      getUserDetail() {
        ApiUser.getUserDetail().then(res => {
          this.self.userState = res.user.userState
        })
      },
      handleEdit(data) {
        this.$prompt(' ', '编辑', {
          inputValue: data.name,
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value.trim() === '') {
            this.$message({ type: 'warning', message: '内容不能为空' })
            return
          }
          Api.addCategory({
            categorys: [{ ...data, name: value }]
          }).then(res => {
            if (res.categorys) {
              this.$message({ type: 'success', message: '操作成功' })
              this.$set(data, 'name', value)
            }
          })
        })
      },
      handleRemove(data, i) {
        Api.addCategory({
          categorys: [{ ...data, status: 'd' }]
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.works.splice(i, 1)
        })
      },
      handleAdd() {
        this.$prompt(' ', '新增', {
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value.trim() === '') {
            this.$message({ type: 'warning', message: '内容不能为空' })
            return
          }
          Api.addCategory({
            categorys: [
              {
                name: value,
                groupId: this.USER.id,
                type: '96',
                status: '1'
              }
            ]
          }).then(res => {
            if (res.categorys) {
              this.$message({ type: 'success', message: '操作成功' })
              this.works.push(...res.categorys)
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  .pd .el-dropdown {
    display: block;
  }
</style>
