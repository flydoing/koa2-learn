<template>
  <div id="medal-wall">
    <template v-if="groupType=='5'">
      <div class="mw-title"
           v-html="title"></div>
    </template>
    <template v-else>
      <item @click="handleStudent">
        <div slot="main">学生</div>
        <div slot="remark"
             v-html="title"></div>
      </item>
    </template>
    <div class="medal-list">
      <div v-for="(item,i) in list"
           :key="i"
           :item="item"
           class="ml-item">
        <!-- <div class="md-dimension">
          <div v-html="item.name"></div>
        </div> -->
        <div class="category-title text"
             v-html="item.name"></div>
        <div class="md-content pd">
          <div class="md-item"
               v-for="(medal,j) in item.childs"
               :key="j">
            <Medal :medal="medal"></Medal>
            <div class="md-count">{{medal.count}}枚</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: {
      params: { type: Object }
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    data() {
      return {
        title: '',
        list: []
      }
    },
    computed: {},
    created() {
      if (this.params) {
        let tp = this.getStorage('_summary_type_cache', true)
        if (tp === 'medal') {
          let user = this.getStorage('_summary_user_cache') || {}
          this.studentId = user.userId
          this.getStorage('_summary_type_cache')
        }

        Api.loadMedalWallData({
          groupId: this.params.groupId,
          timeType: this.params.timeType,
          startTime: this.params.startDate,
          endTime: this.params.endDate,
          userId: this.studentId
        }).then(res => {
          this.title = res.remark
          this.list = res.itemStatistics.map(v => {
            v.name = v.categoryName
            v.childs = v.childs.map(c => {
              c.name = c.categoryName
              c.logo = c.categoryLogo
              return c
            })
            return v
          })
        })
        this.groupType = this.currentGroup.type
      }
    },
    methods: {
      handleStudent() {
        this.setStorage('_summary_type_cache', 'medal')
        this.routePush({ name: 'selectStudent1005' })
      }
    }
  }
</script>
<style lang="scss">
  #medal-wall {
    .vx-item {
      border-top: rem(1) solid #ededed;
    }
  }

  .mw-title {
    text-align: center;
    margin: rem(5) 0 rem(10) 0;
  }

  .medal-list {
    padding-bottom: rem(20);
    display: block;
    .ml-item {
      display: block;
      width: 100%;
      .md-dimension {
        display: block;
        padding-left: rem(18);
        height: rem(30);
        line-height: rem(30);
        position: relative;
        &:before {
          width: rem(8);
          height: rem(30);
          background: #ededed;
          position: absolute;
          left: 0;
          top: 0;
          content: ' ';
        }
      }
      .md-content {
        @extend %clearfix;
        .md-item {
          float: left;
          .medal-03 {
            float: none !important;
          }
          .md-count {
            text-align: center;
            margin-top: rem(5);
          }
        }
      }
    }
  }
</style>
