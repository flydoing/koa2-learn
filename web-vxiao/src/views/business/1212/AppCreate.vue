<template>
  <page title="新建场所预约"
        closePrompt
        @back="handleBack"
        listenBack>
    <div class="place-reserve-create">
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
                            v-for="(item,i) in types"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item class="pr-time"
            :hasClick="false">
        <div slot="main">时间</div>
        <div slot="after">
          <el-date-picker v-model="form.date"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          :picker-options="dateOptions"
                          @change="handleDate"></el-date-picker>
        </div>
      </item>
      <template v-if="form.periods.length > 0">
        <div class="category-title text">时段</div>
        <el-row class="pr-periods">
          <el-col v-for="(item, i) in form.periods"
                  class="period-item"
                  :span="4"
                  :key="i"
                  :class="{'active':item.active}"
                  @click.native="handlePeriod(item, i)">
            <div>
              <div>{{item.start}} ~ {{item.end}}</div>
              <div>{{item.places.length}}个场所</div>
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-if="form.places.length > 0">
        <div class="category-title text">可用场所</div>
        <item v-for="(item, i) in form.places"
              :key="i"
              :item="item"
              @click="handlePlace(item)">
          <div slot="main"
               v-html="item.placeName"></div>
        </item>
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          date: '',
          type: null,
          periods: [],
          places: []
        },
        types: [],
        dateOptions: {
          disabledDate(time) {
            return time.getTime() < new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getTime()
          }
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        placeReserve: 'getPlaceReserve'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      }
    },
    methods: {
      ...mapActions(['setPlaceReserve']),
      fetchData() {
        const that = this
        if (this.placeReserve.form) {
          that.form = JSON.parse(JSON.stringify(this.placeReserve.form))
        }
        CategoryApi.getCategorysByType('153').then(res => {
          that.types = res.categorys
          that.form.type = res.categorys[0]
        })
      },
      getPlaces() {
        let type = this.form.type
        let date = this.form.date
        if (type && !Check.isNullString(date)) {
          Api.loadPlaceList(this.currentGroup.groupId, type.value, date).then(res => {
            this.form.periods = res.datas.map(v => {
              v.active = false
              v.places = v.places || []
              return v
            })
          })
        }
      },
      handlePeriod(item, index) {
        item.active = !item.active
        this.$set(this.form.periods, index, item)

        let fIndex = -1
        let flag = true
        this.form.periods.forEach((v, i) => {
          if (flag && v.active) {
            fIndex = i
            flag = false
          }
        })

        if (fIndex !== -1) {
          this.form.periods.forEach((v, i) => {
            let it = { ...v }
            if (i >= fIndex && i <= index) {
              it.active = true
            } else {
              it.active = false
            }
            this.$set(this.form.periods, i, it)
          })
        }

        let ps = this.form.periods.filter(v => {
          return v.active
        })
        if (ps.length > 2) {
          ps = ps.sort((a, b) => {
            let v1 = a.places.length
            let v2 = b.places.length
            return v1 - v2
          })
          this.form.places = ps[0].places
        } else if (ps.length > 0) {
          this.form.places = ps[0].places
        } else {
          this.form.places = []
        }
      },
      handlePlace(item) {
        this.setPlaceReserve({ form: this.form, place: item })
        this.routePush({ name: 'addExplain1212' })
      },
      handleType(item) {
        this.form.type = item
        this.getPlaces()
      },
      handleDate(date) {
        this.form.date = date
        this.getPlaces()
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .place-reserve-create {
    .pr-periods {
      width: 100%;
      @include flex;
      @include jc(flex-start);
      @include wrap;
      overflow: hidden;
      .period-item {
        height: rem(100);
        position: relative;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        border-bottom: #ededed solid rem(1);
        border-right: #ededed solid rem(1);
        text-align: center;
        &.active {
          @include bc;
          color: #fff;
          &:hover {
            @include bc;
          }
        }
        &:hover {
          background: #f8f8f8;
        }
      }
    }
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }
    .pr-time input {
      min-width: initial !important;
    }
  }
</style>
