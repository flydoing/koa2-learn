<template>
  <page :title="title"
        @scrollEnd="scrollEnd"
        :showTips="list.length === 0">
    <div slot="top"
         class="top-operate">
      <el-row>
        <el-col v-for="(item, i) in operates"
                :key="i"
                :span="12">
          <div class="op-item is-click"
               :class="{'first': i === 0}"
               @click="handleOperate(item)">{{item.label}}&#12288;<i class="ico"
               :class="{'ico-up': item.state, 'ico-down': !item.state}" /></div>
        </el-col>
      </el-row>
    </div>
    <template v-if="curOperate">
      <item v-for="(item,i) in curOperate.datas"
            :key="i"
            :label="conditionTxt(item)"
            @click="handleCondition(item)">
      </item>
    </template>
    <template v-else>
      <item v-for="(item,i) in list"
            :key="i"
            :hasClick="false"
            :label="itemTxt(item)"
            :remark="item.schoolName">
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        operates: [
          {
            label: '省份',
            value: '1',
            state: false,
            datas: []
          },
          {
            label: '批次',
            value: '2',
            state: false,
            datas: []
          }
        ],
        list: [],
        page: 1,
        pageCount: 1
      }
    },
    created() {
      Api.getProvinces().then(res => {
        this.operates[0].datas = res.majors || []
        this.operates[0].datas.unshift({ areaName: '不限' })
      })
      Api.getLevels().then(res => {
        this.operates[1].datas = res.majors || []
        this.operates[1].datas.unshift({ level: '不限' })
      })
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      },
      curOperate() {
        return this.operates.filter(v => {
          return v.state
        })[0]
      }
    },
    methods: {
      itemTxt(item) {
        return `${item.majorName}（${item.level}）`
      },
      conditionTxt(item) {
        return item.areaName || item.level
      },
      fetchData(append) {
        let level = this.operates[1].label
        let province = this.operates[0].label
        let major = {
          majorKey: this.routeQuery('key')
        }
        if (province !== '不限' && province !== '省份') {
          major.areaName = province
        }
        if (level !== '不限' && level !== '批次') {
          major.level = level
        }

        Api.getMajors({ major: major, page: this.page }).then(res => {
          if (append && res.majors) {
            this.list.push(...res.majors)
          } else {
            this.list = res.majors || []
          }
          this.pageCount = res.pageCount || this.pageCount
        })
      },
      handleOperate(item) {
        this.operates = this.operates.map(v => {
          if (item.value === v.value) {
            v.state = !item.state
          } else {
            v.state = false
          }
          return v
        })
      },
      handleCondition(item) {
        let op = this.curOperate
        if (op.value === '1') {
          this.$set(this.operates, 0, { ...op, label: item.areaName, state: false })
        } else {
          this.$set(this.operates, 1, { ...op, label: item.level, state: false })
        }

        this.page = 1
        this.fetchData()
      },
      scrollEnd() {
        if (!this.curOperate && this.page < this.pageCount) {
          this.page++
          this.fetchData(true)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top-operate {
    padding: rem(8) 0;
    border-bottom: rem(1) solid #ebebeb;
    .op-item {
      height: rem(30);
      line-height: rem(30);
      text-align: center;
      &.first {
        border-right: rem(1) solid #ebebeb;
      }
    }
  }
</style>
