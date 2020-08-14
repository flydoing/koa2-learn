<template>
  <page title="选择产品">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <template v-if="results.length>0">
      <item v-for="(data,j) in results"
            :key="j"
            :hasArrow="false"
            :label="data.name"
            @click="handleSelect(data)">
      </item>
    </template>
    <template v-else>
      <div class="app-list">
        <el-collapse accordion
                     v-model="active">
          <el-collapse-item v-for="(item,i) in list"
                            :key="i"
                            :name="i + 1">
            <template slot="title">
              <item :label="item.name"
                    :hasArrow="false"></item>
            </template>
            <template v-if="item.childs">
              <item v-for="(data,j) in item.childs"
                    :key="j"
                    :hasArrow="false"
                    :label="data.name"
                    @click="handleSelect(data)">
                <div slot="before">
                  <img v-lazy="{src:'/static/ico/ico_angle.png'}">
                </div>
              </item>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: [],
        results: [],
        active: 1,
        keyword: ''
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      Api.getApps(this.groupId, true).then(res => {
        this.list = res.categorys || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      handleSelect(data) {
        this.setCreateObject({ app: data })
        this.routeBack()
      }
    },
    watch: {
      keyword(value) {
        if (!Check.isNullString(value)) {
          let apps = []
          this.list.forEach(v => {
            let datas = v.childs.filter(c => {
              return c.name.indexOf(value) !== -1
            })
            if (datas.length > 0) {
              apps.push(...datas)
            }
          })
          this.results = apps
        } else {
          this.results = []
        }
      }
    }
  }
</script>
<style lang="scss">
  .app-list {
    .vx-item {
      &.is-click:hover {
        background: #fff;
      }
      cursor: pointer;
    }
    .el-collapse {
      border-top: 0 !important;
    }
    .el-collapse-item__content {
      padding-bottom: 0 !important;
      & > div:last-child {
        &:after {
          height: 0;
        }
      }
    }
  }
</style>
