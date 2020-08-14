<template>
  <Card :message="msg"
        @detail="handleDetail">
    <template slot="titles">
      <div v-if="columnTxt">{{columnTxt}}</div>
      <div v-if="msg.remark"
           v-html="msg.remark"></div>
    </template>
    <template slot="toolbar">
      <div class="card-counter">
        <div class="counter text-label left">已阅{{message.readCount}}</div>
        <div class="counter right">
          <span>
            <i :class="icoPraise"
               @click="handlePraise"></i>
            <span class="f12"
                  v-if="praises.length > 0">{{praises.length}}</span>
          </span>
          <i class="ico ico-reply"
             @click="handleDetail"></i>
          <span class="number f12"
                v-if="message.reviewCount > 0">{{message.reviewCount}}</span>
        </div>
      </div>
    </template>
    <CardImages slot="images"
                :images="images"
                v-if="images.length>0"></CardImages>
    <CardDown slot="down"
              :m="msg">
      <el-dropdown-item v-if="isSuperAdmin || msg.fromUserId == userId"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
      <el-dropdown-item v-if="isOvert && isSuperAdmin"
                        @click.native.stop="handleOvert">{{overtTxt}}</el-dropdown-item>
      <el-dropdown-item v-if="isNysc && isSuperAdmin"
                        @click.native.stop="handleNysc">{{nyscTxt}}</el-dropdown-item>
    </CardDown>
    <CardHref v-if="button"
              slot="href"
              :content="button.text"
              @click="handleDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        msg: this.message
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      button() {
        return {
          text: '查看详情',
          handle: this.detailHanle
        }
      },
      images() {
        if (this.m.images.length > 0) {
          return this.m.images.filter(v => {
            return v.status === '2'
          })
        }
        return []
      },
      columnTxt() {
        return this.msg.categoryName ? `所属栏目：${this.msg.categoryName}` : ''
      },
      overtMeta() {
        return this.filterMeta('m_portal_open_need_approve')
      },
      isOvert() {
        return this.overtMeta && this.overtMeta.obj === '1'
      },
      overtTxt() {
        return this.msg.isPrivate !== '1' ? '取消校内公开' : '校内公开'
      },
      nyscMeta() {
        return this.filterMeta('m_portal_syn_network_need_approve')
      },
      isNysc() {
        return this.nyscMeta && this.nyscMeta.obj === '1'
      },
      nyscTxt() {
        return this.msg.msgType !== '1' ? '同步至官网' : '取消同步至官网'
      },
      praises() {
        // 判断praise 中isPraise 为1状态的数据
        let _praises = this.message.praises || []
        return _praises.filter(p => {
          return p.isPraise === 1
        })
      },
      icoPraise() {
        let _praises =
          this.praises.filter(p => {
            return p.userId === this.userId
          }) || []
        return [
          `ico`,
          {
            [`ico-heart`]: _praises.length === 0,
            [`ico-heart-press`]: _praises.length > 0
          }
        ]
      }
    },
    methods: {
      filterMeta(type) {
        const meta = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === this.currentGroup.groupId
        })[0]
        return meta
      },
      handleLabel() {
        if (this.msg.categoryId) {
          this.setStorage('_message_params_cache', {
            type: '1011',
            categoryId: this.msg.categoryId,
            queryType: 'category'
          })
          this.setStorage('_message_list_refresh', true)
          this.routePushModel({
            path: '/vx/group/business/message/list',
            query: {
              title: this.msg.categoryName
            }
          })
        } else {
          this.handleLogo({ queryType: 'appType' })
        }
      },
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1011',
            groupId: this.currentGroup.groupId,
            msgId: this.msg.id
          }
        })
      },
      handleOvert() {
        let m = { ...this.msg, isPrivate: this.msg.isPrivate !== '1' ? '1' : '0' }
        this.modifyMessage(m).then(res => {
          this.$set(this, 'msg', res.messages[0])
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleNysc() {
        let m = { ...this.msg, msgType: this.msg.msgType !== '1' ? '1' : '0' }
        this.modifyMessage(m).then(res => {
          this.$set(this, 'msg', res.messages[0])
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleDetail() {
        this.routePushModel({
          name: 'cardDetail',
          params: { msgId: this.msg.id },
          query: { type: this.msg.type }
        })
      }
    }
  }
</script>
