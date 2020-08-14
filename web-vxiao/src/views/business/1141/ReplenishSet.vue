<template>
  <page title="自动补货"
        @submit="handleSubmit"
        hasSubmit>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">类型</div>
          <div slot="remark"
               v-html="typeTxt"></div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(type,i) in types"
                          :key="i"
                          :type="type"
                          :command="type">{{type.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item :hasClick="false">
      <div slot="main">补货标准</div>
      <input slot="remark"
             placeholder="必填"
             v-model="sets.level" />
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        sets: {
          level: '',
          period: '0'
        },
        types: [
          {
            name: '关闭',
            value: '0',
            selected: false
          },
          {
            name: '每周',
            value: '1'
          },
          {
            name: '每月',
            value: '2',
            selected: false
          }
        ]
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        prize: 'getPrize'
      }),
      typeTxt() {
        let type = this.types.filter(v => {
          return v.selected
        })[0]
        return type ? type.name : ''
      }
    },
    methods: {
      ...mapActions(['setPrize']),
      fectchData() {
        let that = this
        let sets = that.prize.thing.sets
        if (sets) {
          that.sets = { ...sets }
          that.types = that.types.map(v => {
            v.selected = v.value === sets.period
            return v
          })
        }
      },
      handleType(item) {
        this.types = this.types.map(v => {
          v.selected = v.value === item.value
          return v
        })
        this.sets.period = item.value
      },
      handleSubmit() {
        const that = this
        let type = this.types.filter(v => {
          return v.selected
        })[0]
        if (!type) {
          that.$message({ message: '请选择补货周期', type: 'warning' })
          return false
        }
        if (type && Check.isNullString(that.sets.level)) {
          that.$message({ message: '补货标准不能为空', type: 'warning' })
          return false
        }
        that.setPrize({ thing: { ...that.prize.thing, sets: that.sets } })
        that.routeBack()
      }
    }
  }
</script>
