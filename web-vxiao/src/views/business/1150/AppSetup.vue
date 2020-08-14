<template>
  <Setup appType="115003">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('115003'))"
              slot="others">
      <Item @click="onCount">
        <div>每人最大借书数量限制</div>
        <div slot="remark">{{countMeta.obj}}</div>
      </Item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleDay">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">图书可借阅天数</div>
            <div slot="remark"
                 v-html="dayCount"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(day,i) in days"
                            :key="i"
                            :command="day">{{day.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        days: [
          {
            name: '15天',
            value: 15
          },
          {
            name: '30天',
            value: 30
          },
          {
            name: '45天',
            value: 45
          },
          {
            name: '60天',
            value: 60
          },
          {
            name: '75天',
            value: 75
          },
          {
            name: '90天',
            value: 90
          }
        ],
        dayMeta: null
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      countMeta() {
        let meta = {
          obj: 3,
          metaType: 'v_max_borrow_books',
          extension: this.groupId,
          userId: this.currentGroup.parentId,
          key: '115003',
          status: '1'
        }
        this.metaDatas.some(m => {
          if (m.metaType === 'v_max_borrow_books' && m.extension === this.groupId && m.key === '115003' && m.status === '1') {
            meta = m
            return true
          }
        })
        return meta
      },
      dayCount() {
        return this.dayMeta ? this.dayMeta.obj || '' : ''
      }
    },
    created() {
      Api.getDayMetaDta(this.currentGroup.parentId).then(res => {
        this.dayMeta = res.metaDatas[0]
      })
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      onCount() {
        this.$prompt(' ', '修改', {
          inputPlaceholder: '数量',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            let meta = this.countMeta
            meta.obj = value
            this.modifyMetaData(meta).then(res => {
              this.$message({ message: '操作成功', type: 'success' })
            })
          })
          .catch(() => {})
      },
      handleDay(day) {
        if (this.dayMeta) {
          this.modifyMetaData({ ...this.dayMeta, obj: day.value }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.dayMeta = res.metaDatas[0]
          })
        }
      }
    }
  }
</script>
