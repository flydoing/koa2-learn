<template>
  <page title="选择勋章"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <div class="pd">
      <div v-if="score"
           class="surplus">剩余积分：{{score}}分</div>
      <div class="user-item"
           v-html="userTxt"></div>
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
  import Text from '@/utils/text'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    props: {},
    data() {
      return {
        list: [],
        andTxt: '',
        userTxt: '',
        active: 1,
        score: 0
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
        evaluate: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        const that = this

        let list = []
        Api.loadUserMedals(that.groupId).then(res => {
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
          that.list = list
          that.score = res.remainScore || 0
        })

        let users = that.evaluate.users
        if (Check.isRealArray(users)) {
          let txt = ''
          users.forEach((u, i) => {
            txt = txt.concat(`{\\@\\${u.name}\\${u.userId}\\}${i === users.length - 1 ? '' : ' '}`)
          })
          that.andTxt = txt
          that.userTxt = Text.changeAnd(txt)
        }
      },
      medalClick(dimension, medal, index, pIndex) {
        medal.active = !medal.active
      },
      handleSubmit() {
        let that = this

        let medals = []
        that.list.map(v => {
          let mds = v.childs.filter(c => {
            return c.active
          })
          medals = [...medals, ...mds]
        })

        let users = []
        let notifys = []
        that.evaluate.users.map(v => {
          var u = {
            userId: v.userId,
            name: v.name,
            status: 1
          }

          if (v && v.userType) {
            u.userType = v.userType
          }

          users.push(u)
          notifys.push(u.userId)
        })

        let medal = {
          datas: []
        }
        medals.forEach((m, i) => {
          if (i === 0) {
            medal = {
              ...medal,
              ...m
            }
          }
          medal.datas.push(m)
        })

        let postData = that.constructionMessage({
          type: '1005',
          groupId: that.currentGroup.groupId,
          toUsers: users,
          notify: notifys,
          extensionType: JSON.stringify(medal),
          content: that.andTxt.concat('\n'),
          isPrivate: '0'
        })

        this.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.modifyCreateObjectField('users')
          that.routeBack(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .user-item {
    text-align: center;
    padding: rem(10) 0;
  }

  .surplus {
    text-align: center;
    padding-top: rem(10);
  }

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
