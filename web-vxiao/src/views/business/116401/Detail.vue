<template>
  <page title="排考详情">
    <div class="arrangeExam-detail">
      <item :hasClick="false">
        <div slot="main">考试名称</div>
        <div slot="remark"
             class="ellipsis"
             v-html="detail.name"></div>
      </item>
      <template v-if="msgType == '2'">
        <div v-for="(item,i) in detail.datas"
             :key="i"
             :item="item">
          <div class="category-title text"><span>{{item.campusName}} {{item.gradeName}}</span><a class="ad-time"
               @click="handleTime(item)">考试时间</a></div>
          <item v-for="(child,j) in item.reexams"
                :key="j"
                :child="child"
                @click="handleItem(child)">
            <div slot="main">{{child.campusName}} {{child.examPlaceName}}</div>
          </item>
        </div>
      </template>
      <template v-else>
        <item :hasClick="false">
          <div slot="main">考试时间</div>
          <div slot="remark"
               class="ellipsis"
               v-html="detail.date"></div>
        </item>
        <div v-for="(item,i) in detail.datas"
             :key="i"
             :item="item">
          <div class="category-title text"
               v-html="item.name"></div>
          <item v-for="(child,j) in item.datas"
                :key="j"
                :child="child"
                @click="handleItem(child)">
            <div slot="main"
                 v-html="itemTxt(child)"></div>
            <div slot="remark"
                 class="ellipsis"
                 v-html="itemRemark(child)"></div>
          </item>
        </div>
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MessageApi from '@/api/message'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Table: resolve => require(['@/components/table/Table'], resolve)
    },
    props: {},
    computed: {},
    data() {
      return {
        detail: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this
        that.msgType = that.routeQuery('type')
        that.msgId = that.routeParam('msgId')

        if (that.msgType === '2') {
          MessageApi.getMessageById(that.msgId).then(res => {
            let datas = []
            if (res.message.msgJson) {
              let mJson = JSON.parse(res.message.msgJson)
              if (Check.isRealArray(mJson)) {
                datas = mJson.map(v => {
                  return {
                    subjects: v.subjects,
                    campusId: v.reexams[0].campusId,
                    campusName: v.reexams[0].campusName,
                    gradeId: v.reexams[0].gradeId,
                    gradeName: v.reexams[0].gradeName,
                    reexams: v.reexams
                  }
                })
              }
            }
            that.detail = { name: res.message.title, datas: datas }
          })
        } else {
          Api.loadArrangeExamDetail(that.msgId).then(res => {
            that.detail = {
              name: res.title,
              date: `${DateUtils.format(res.startDate, DateUtils.MD)} 至 ${DateUtils.format(res.endDate, DateUtils.MD)}`,
              datas: res.datas
            }
          })
        }
      },
      itemTxt(item) {
        if (this.msgType === '5' && item.data) {
          let json = JSON.parse(item.data)
          return `${json[0][1]} ${json[0][2]}`
        }
        return item.name
      },
      itemRemark(item) {
        if (this.msgType === '5') {
          return '查看展示信息'
        }
        return item.value ? '【图片】' : '【表格】'
      },
      handleItem(item) {
        if (this.msgType === '5') {
          let json = JSON.parse(item.data)
          this.routePush({
            name: 'examPlaceInfo116401',
            query: {
              pId: item.id,
              title: `展示信息 - ${json[0][1]}`
            }
          })
        } else {
          let obj = { name: 'seatInfo116401' }
          if (this.msgType === '2') {
            this.setArrangeExam({ seats: JSON.parse(item.seat) })
          } else {
            if (item.value) {
              this.setArrangeExam({ image: item.value })
            } else {
              this.setArrangeExam({ image: null })
              obj.query = { pId: item.id }
            }
          }
          this.routePush(obj)
        }
      },
      handleTime(item) {
        this.setArrangeExam({ times: item.subjects })
        this.routePushModel({
          name: 'times116401'
        })
      }
    }
  }
</script>
<style lang="scss">
  .arrangeExam-detail {
    .ad-time {
      float: right;
      cursor: pointer;
    }
  }
</style>
