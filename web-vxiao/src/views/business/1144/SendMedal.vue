<template>
  <page title="选择勋章"
        @submit="handleSubmit"
        hasSubmit>
    <div class="pd">
      <div class="medal-list">
        <el-collapse accordion
                     v-model="active">
          <el-collapse-item v-for="(item,i) in list"
                            :key="i"
                            :item="item"
                            class="ml-item"
                            :name="i + 1">
            <template slot="title">
              <div class="md-dimension">{{item.name}}</div>
            </template>
            <div class="md-content">
              <div class="md-block"
                   :class="{'active':medal.active}"
                   v-for="(medal,j) in item.childs"
                   :key="j"
                   :medal="medal"
                   @click="medalClick(item, medal, j, i)">
                <Medal :medal="medal"></Medal>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    props: {},
    data() {
      return {
        list: [],
        active: 1
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      MedalList: resolve => require(['@/views/components/medal/MedalList'], resolve),
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    computed: {
      ...mapGetters({
        classMedal: 'getClassMedal'
      })
    },
    methods: {
      ...mapActions(['setClassMedal']),
      fetchData() {
        const that = this

        let list = []
        Api.loadUserMedalList(that.currentGroup.groupId).then(res => {
          res.categorys.forEach((v, i) => {
            if (i === 0) {
              v.isShow = true
            } else {
              v.isShow = false
            }

            let childs = []
            v.childs.map(c => {
              c.active = false
              childs.push(c)
            })
            v.childs = childs

            list.push(v)
          })
        })
        that.list = list
      },
      medalClick(dimension, medal, index, pIndex) {
        this.list = this.list.map(v => {
          if (v.childs) {
            v.childs = v.childs.map(c => {
              c.active = medal.id === c.id
              return c
            })
          }
          return v
        })
      },
      handleSubmit() {
        const that = this

        let medal = null
        that.list.map(v => {
          let md = v.childs.filter(c => {
            return c.active
          })[0]
          md && (medal = md)
        })

        if (!medal) {
          this.$message({ message: '请选择奖章', type: 'warning' })
          return false
        }

        let group = that.classMedal.group
        let postData = that.constructionMessage({
          type: '114401',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify([
            {
              groupId: group.groupId,
              categoryId: medal.id
            }
          ]),
          extensionType: JSON.stringify({
            datas: [medal]
          })
        })

        this.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .medal-list {
    padding-bottom: rem(20);
    display: block;
    .ml-item {
      display: block;
      width: 100%;
      .md-dimension {
        padding-left: rem(18);
        display: block;
        position: relative;
        &:before {
          width: rem(8);
          height: rem(30);
          background: #ededed;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: rem(-15);
          content: ' ';
        }
      }
      .md-content {
        @extend %clearfix;
        .md-block {
          margin: rem(8) rem(8) 0 0;
          position: relative;
          float: left;
          cursor: pointer;
          &:after {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 0;
            z-index: 998;
            border-radius: rem(8);
            background: #000;
            opacity: 0.5;
            filter: alpha(opacity=50);
            content: ' ';
            left: 0;
            transition: all ease 0.3s;
            box-sizing: border-box;
          }
          &:hover:after {
            height: 100%;
          }
          &.active:after {
            background: url('~images/ico/icon_choose.png') no-repeat;
            background-size: 100% 100%;
            opacity: 1;
            height: 100%;
          }
          .medal-03 {
            margin: 0;
          }
        }
      }
    }
  }
</style>
