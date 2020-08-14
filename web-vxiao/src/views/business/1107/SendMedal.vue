<template>
  <page title="选择勋章"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <div class="pd">
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
  import MessageApi from '@/api/message'
  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        userTxt: '',
        active: 1,
        message: {}
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
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['modifyCreateObjectField']),
      fetchData() {
        const that = this
        MessageApi.getMessageById(this.routeQuery('msgId')).then(res => {
          this.message = res.message
        })
        Api.getMedals(this.routeQuery('groupId')).then(res => {
          if (res.category) {
            that.list = [
              {
                ...res.category,
                isShow: true,
                childs: res.category.childs.map(c => {
                  c.active = false
                  return c
                })
              }
            ]
          }
        })

        let users = that.obj.users
        if (Check.isRealArray(users)) {
          let txt = ''
          users.forEach((u, i) => {
            txt = `${txt}{\\@\\${u.name}\\${u.userId}\\}${i === users.length - 1 ? '' : ' '}`
          })
          that.userTxt = Text.changeAnd(txt)
        }
      },
      medalClick(dimension, medal, index, pIndex) {
        medal.active = !medal.active
      },
      handleSubmit() {
        const that = this
        let medals = []
        that.list.map(v => {
          let mds = v.childs.filter(c => {
            return c.active
          })
          medals = [...medals, ...mds]
        })

        let users = that.obj.users.map(v => {
          return {
            userId: v.userId,
            name: v.name,
            userType: v.userType,
            status: 1
          }
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
          id: this.routeQuery('msgId'),
          type: '1107',
          groupId: this.routeQuery('groupId'),
          toUsers: users,
          extensionType: JSON.stringify(medal),
          content: this.message.content,
          msgType: '1'
        })

        this.modifyMessage(postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.modifyCreateObjectField('users')
          this.routeBack(-2)
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
