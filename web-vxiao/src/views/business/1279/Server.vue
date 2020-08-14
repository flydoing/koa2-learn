<template>
  <Page :title="typeTitle"
        hasSubmit
        @submit="onSubmit">
    <div v-for="(item, i) in serverCategorys"
         :key="i">
      <Item :hasClick="false"
            label="服务器IP"
            v-if="item.status !== 'd'">
        <input slot="remark"
               v-model="item.value"
               placeholder="输入新IP" />
        <div slot="after">
          <i class="ico ico-delete"
             @click.stop="handleDelete(item, i)" />
        </div>
      </Item>
    </div>
    <Item @click="handleAdd()"
          label="新增服务器IP">
      <div slot="before">
        <i class="ico ico-plus" />
      </div>
      <span slot="after"></span>
    </Item>
    <div class="agreement-list"
         v-for="(item, i) in visionCameraProtocolAccounts"
         :key="i">
      <div class="category-title">{{item.protocolName}}</div>
      <!-- 默认协议 -->
      <div v-if="i === 0">
        <Item :hasClick="false"
              label="默认协议">
          <div slot="remark">{{item.account}}</div>
        </Item>
      </div>
      <!-- 其它协议 -->
      <div v-if="i !== 0">
        <Item :hasClick="false"
              label="账号">
          <input slot="remark"
                 v-model="item.account"
                 placeholder="输入账号" />
        </Item>
        <Item :hasClick="false"
              label="密码">
          <input slot="remark"
                 v-model="item.password"
                 placeholder="输入密码" />
        </Item>
      </div>

      <!-- <div class="category-title">协议1</div>
      <Item :hasClick="false"
            label="账号">
        <input slot="remark"
              v-model="accont"
              placeholder="输入账号" />
      </Item>
      <Item :hasClick="false"
            label="密码">
        <input slot="remark"
              v-model="pass"
              placeholder="输入密码" />
      </Item> -->
    </div>

  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
  export default {
    data() {
      return {
        groupId: '',
        visionCameraProtocolAccounts: [],
        ip: '1.111.22.3',
        type: '', // 录播228,直播227
        serverCategorys: []
      }
    },
    computed: {
      typeTitle() {
        return this.type === '227' ? '直播服务器IP' : '录播服务器IP'
      }
    },
    created() {
      this.groupId = this.routeQuery('groupId')
      this.type = this.routeQuery('type')
      this.getServerCategorys()
    },
    methods: {
      handleDelete(item, i) {
        let category = item
        // 不存在id直接删
        if (!category.id) {
          this.serverCategorys.splice(i, 1)
        } else if (category.id && category.value === '') {
          this.$message({ type: 'warning', message: '编辑不能留空！' })
        } else {
          // 有id改为d
          this.serverCategorys.map(cate => {
            if (cate.id === item.id) {
              cate.status = 'd'
            }
          })
        }
        // let category = item
        // if (category.value === '') {
        //   this.serverCategorys.splice(i, 1)
        //   return
        // }
        // category.status = 'd'
        // CategoryApi.addCategory(category).then(res => {
        //   this.$message({ type: 'success', message: '修改成功' })
        //   this.routeBack()
        // })
      },
      handleAdd() {
        this.serverCategorys.push({
          groupId: this.groupId,
          // name: '',
          type: this.type,
          value: ''
        })
      },
      getServerCategorys() {
        CategoryApi.getCategorys({
          groupId: this.groupId,
          type: this.type
        }).then(res => {
          if (res.code === '1' && res.categorys) {
            this.serverCategorys = res.categorys
          }
        })
      },
      onSubmit() {
        let serverCategorys = this.serverCategorys
        let isHasNull = serverCategorys.some((item, i) => {
          if (i !== 0) {
            return Check.isNullString(item.value)
          }
        })
        if (isHasNull) {
          this.$message({ type: 'warning', message: '不能留空！' })
          return
        }
        CategoryApi.addCategory(serverCategorys).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      },
      getVisionProtocolaccount() {
        Api.getVisionProtocolaccount(this.groupId).then(res => {
          if (res.code === '1' && res.visionCameraProtocolAccounts) {
            this.visionCameraProtocolAccounts = res.visionCameraProtocolAccounts
          }
        })
      },
      onSubmit11() {
        let visionCameraProtocolAccounts = this.visionCameraProtocolAccounts
        let isHasNull = visionCameraProtocolAccounts.some((item, i) => {
          if (i !== 0) {
            return Check.isNullString(item.account) || Check.isNullString(item.password)
          }
        })
        if (isHasNull) {
          this.$message({ type: 'warning', message: '账号密码不能为空！' })
          return
        }
        // 判断空
        Api.addProtocolaccount({
          visionCameraProtocolAccounts: visionCameraProtocolAccounts
        }).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
