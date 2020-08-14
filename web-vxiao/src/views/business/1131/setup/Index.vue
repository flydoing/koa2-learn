<template>
  <Setup appType="'1131'">
    <template slot="split"></template>
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1131'))"
              slot="others">
      <template v-for="(c,i) in categories">
        <div :key="i">
          <div class="category-title text">{{c.name}}</div>
          <Item v-for="(meta,j) in c.metaDatas"
                @click="handle(meta)"
                :key="j">
            <div v-if="meta.key==='once_limit'">单次消费限额</div>
            <div v-if="meta.key==='day_limit'">每日消费限额</div>
            <div slot="remark">{{meta.obj}}</div>
          </Item>
        </div>
      </template>
    </template>
  </Setup>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        categories: []
      }
    },
    created() {
      Api.loadConsume(this.currentGroup.parentId).then(res => {
        this.categories = res.categories || []
      })
    },
    methods: {
      handle(meta) {
        this.$prompt(meta.key === 'once_limit' ? '单次消费限额' : '每日消费限额', meta.metaType === 'm_consumer_settings_student' ? '学生限额' : '老师限额', {
          inputValue: meta.obj,
          inputPlaceholder: '输入金额',
          inputPattern: /^[0-9]+(.[0-9]{2})?$/,
          inputErrorMessage: '金额只能是数字，且小数点保留2未',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '修改中...'
              Api.modifyConsume({
                metaDatas: [{ ...meta, obj: instance.inputValue }]
              })
                .then(res => {
                  this.$set(meta, 'obj', instance.inputValue)
                  this.$message({ type: 'success', message: '修改成功' })
                  instance.confirmButtonLoading = false
                  done()
                })
                .catch(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        })
      }
    }
  }
</script>
