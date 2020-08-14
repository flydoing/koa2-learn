<template>
  <scroller :height="h">
    <div v-for="(v,k) in apps" :key="k">
      <div class="category-title text">{{k==='1'?'学校年鉴':k==='2'?'班级年鉴':'成长年鉴'}}</div>
      <item v-for="(option,i) in v" :key="i" @click="handle(option,k)">
        <div slot="main">{{option.name}}</div>
        <div slot="remark">
          <i-switch :value.sync="option.ischecked" trueValue='1' falseValue="0" @click="handleOpen(option)"></i-switch>
        </div>
      </item>
    </div>
  </scroller>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    data() {
      return { apps: {}, $m: null }
    },
    methods: {
      handle(option, type) {
        this.routePush({
          name: 'optionLogo',
          query: { type: type }
        })
      },
      handleOpen(option) {
        Api.modifyOption(this.routeParam('id'), option).then(res => {
          this.$message({ message: '修改成功', type: 'success' })
        })
      }
    },
    mounted() {
      const that = this
      const loading = that.$loading({ target: '.vx-main' })
      Api.getOptions(that.routeParam('id')).then(res => {
        loading.close()
        if (Check.isRealArray(res.options)) {
          that.apps = (options => {
            let obj = { 1: [], 2: [], 3: [] }
            options.forEach(option => {
              obj[option.type].push(option)
            })
            return obj
          })(res.options)
        } else {
          that.$m = that.$message({
            duration: 0,
            message: '暂无数据',
            type: 'error'
          })
        }
      }).catch(() => {
        loading.close()
      })
    },
    beforeDestroy() {
      this.$m && this.$m.close()
    }
  }

</script>
