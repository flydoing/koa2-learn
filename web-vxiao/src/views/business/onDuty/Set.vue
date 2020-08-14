<template>
  <page title="值日生设置">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleArrange">
      <div class="el-dropdown-link">
        <item label="安排方式"
              :remark="ag.name">
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in arranges"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleLoop">
      <div class="el-dropdown-link">
        <item label="循环方式"
              :remark="lp.name">
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in loops"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        loops: [
          {
            name: '单周',
            value: '1',
            selected: false
          },
          {
            name: '双周',
            value: '2',
            selected: false
          }
        ],
        arranges: [
          {
            name: '全天',
            value: '1',
            selected: false
          },
          {
            name: '上下午',
            value: '2',
            selected: false
          }
        ],
        metaDatas: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      lpMeta() {
        return this.filterMeta('m_class_duty_loop_type')
      },
      agMeta() {
        return this.filterMeta('m_class_duty_time_type')
      },
      lp() {
        const that = this
        let metaData = null
        let data = this.loops.filter(v => {
          if (v.value === that.lpMeta.obj) {
            metaData = v
          }
          return v.selected
        })[0]
        return data || metaData || this.loops[0]
      },
      ag() {
        const that = this
        let metaData = null
        let data = this.arranges.filter(v => {
          if (v.value === that.agMeta.obj) {
            metaData = v
          }
          return v.selected
        })[0]
        return data || metaData || this.arranges[0]
      }
    },
    components: {},
    methods: {
      ...mapActions(['modifyMetaData']),
      fetchData() {
        Api.getOnDutyMetaDatas(this.groupId).then(res => {
          this.metaDatas = res.metaDatas || []
        })
      },
      filterMeta(type) {
        if (Check.isRealArray(this.metaDatas)) {
          return this.metaDatas.filter(v => {
            return v.metaType === type
          })[0]
        }
        return { metaType: type }
      },
      handleArrange(item) {
        this.modifyMetaData({
          ...this.agMeta,
          obj: item.value,
          extension: this.groupId
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.arranges = this.arranges.map(v => {
            v.selected = v.value === item.value
            return v
          })
        })
      },
      handleLoop(item) {
        this.modifyMetaData({
          ...this.lpMeta,
          obj: item.value,
          extension: this.groupId
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.loops = this.loops.map(v => {
            v.selected = v.value === item.value
            return v
          })
        })
      }
    }
  }
</script>
