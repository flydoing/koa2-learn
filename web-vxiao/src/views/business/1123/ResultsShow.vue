<template>
  <page title="成绩展示"
        hasSubmit
        @submit="handleSubmit">
    <div>
      <item v-for="(item,i) in parameterList"
            :key="i"
            :hasArrow="false"
            @click="handleItem(item)">
        <div v-html="item.name"></div>
        <div slot="remark">
          <i-switch :value="item.boole"
                    @click="handleItem(item)"></i-switch>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    mixins: [G],
    data() {
      return {
        dateValue: '',
        examinationName: '',
        parameterList: [
          { name: '排名', value: 1, boole: false },
          { name: '平均分', value: 2, boole: false },
          { name: '标准分', value: 3, boole: false },
          { name: '方差', value: 4, boole: false },
          { name: '标准差', value: 5, boole: false },
          { name: '分数', value: 6, boole: false }
        ]
      }
    },
    computed: {
      ...mapGetters({
        cacheInfo: 'getCreateInfo'
      })
    },
    created() {
      if (Check.isRealArray(this.cacheInfo.datas)) {
        let dMap = new Map()
        this.cacheInfo.datas.map(v => {
          dMap.set(v.value, v)
        })
        this.parameterList = this.parameterList.map(v => {
          v.boole = Check.isObject(dMap.get(v.value))
          return v
        })
      }
    },
    methods: {
      ...mapActions(['saveCreateInfo', 'clearCreateInfo']),
      handleItem(item) {
        // 排名
        item.boole = !item.boole
      },
      handleSubmit() {
        // 拿到打开的对象，并把对象传到vuex里面
        let datas = this.parameterList.filter(v => {
          return v.boole
        })
        this.saveCreateInfo({ datas })
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .examination-box {
    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    .el-time-panel__content {
      &::before {
        top: 54%;
      }
      &::after {
        top: 54%;
        left: 0;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-left: rem(0);
      padding-right: rem(0);
    }

    .el-time-panel__footer {
      padding-right: rem(15);
    }

    input {
      text-align: right !important;
      min-width: 276px !important;
    }
  }
</style>
