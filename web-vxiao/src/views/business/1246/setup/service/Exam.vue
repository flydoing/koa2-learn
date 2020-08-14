<template>
  <div>
    <Item @click="onTeamView">
      <div>按小组展示</div>
      <div slot="after">
        <i-switch :value.sync="sets.teamView"
                  trueValue="1"
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <Item @click="onShowScore">
      <div>展示分数</div>
      <div slot="after">
        <i-switch :value.sync="sets.showScore"
                  trueValue="1"
                  falseValue="0"></i-switch>
      </div>
    </Item>
    <el-dropdown v-if="sets.teamView==='0'"
                 class="block-element"
                 trigger="click"
                 @command="onLimit">
      <Item>
        <div>展示排名位数</div>
        <div slot="remark">{{showTxt}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="0">展示全部</el-dropdown-item>
        <el-dropdown-item command="10">展示前10位</el-dropdown-item>
        <el-dropdown-item command="15">展示前15位</el-dropdown-item>
        <el-dropdown-item command="20">展示前20位</el-dropdown-item>
        <el-dropdown-item command="25">展示前25位</el-dropdown-item>
        <el-dropdown-item command="30">展示前30位</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title"></div>
  </div>
</template>
<script>
  export default {
    props: {
      app: Object,
      sets: Object
    },
    data() {
      return {
        metaDatas: []
      }
    },
    computed: {
      showTxt() {
        if (!this.sets || this.sets.showLimit === '0') {
          return '展示全部'
        } else {
          return `展示前${this.sets.showLimit}位`
        }
      }
    },
    methods: {
      onLimit(command) {
        this.$set(this.sets, 'showLimit', command)
      },
      onTeamView() {
        this.$set(this.sets, 'teamView', this.sets.teamView === '1' ? '0' : '1')
      },
      onShowScore() {
        this.$set(this.sets, 'showScore', this.sets.showScore === '1' ? '0' : '1')
      }
    }
  }
</script>
