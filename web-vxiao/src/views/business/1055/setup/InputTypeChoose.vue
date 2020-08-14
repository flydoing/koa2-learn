<template>
  <page title="输入格式"
        hasSubmit
        @submit="editCommit">
    <item @click="handleSelect(data,i) "
          v-for="(data,i) in datas"
          :key="i"
          :hasArrow="data.name === '单选按钮' || data.name === '复选框'">
      <div>
        <i class="ico ico-select"
           :class="{'active':currentItem === i}"
           @click.stop="iconSelect(data,i)"></i>
      </div>
      <div>{{data.name}}</div>
      <!-- <div slot="after"></div> -->

    </item>
  </page>
</template>
<script>
  import categoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        datas: [],
        active: false,
        currentItem: -1,
        typeItem: null
      }
    },
    created() {
      this.getCategory()
    },
    computed: {
      ...mapGetters(['getInputType'])
    },
    methods: {
      ...mapActions(['saveInputType']),
      // 获取输入格式分类
      getCategory() {
        categoryApi.getCategorysByType('225').then(res => {
          this.datas = res.categorys
          this.datas.forEach((item, index) => {
            if (item.name === this.getInputType.name) {
              this.currentItem = index
            }
          })
        })
      },
      iconSelect(data, i) {
        this.typeItem = data
        this.currentItem = i
      },
      handleSelect(data, i) {
        this.typeItem = data
        if (data.value === 'select') {
          this.routePush({
            name: 'Detail1055',
            query: {
              title: '单选按钮'
            }
          })
        } else if (data.value === 'multi_select') {
          this.routePush({
            name: 'Detail1055',
            query: {
              title: '复选框'
            }
          })
        }
        this.currentItem = i
        // let active = data.active
        // this.$set(data, 'active', !active)
      },
      editCommit() {
        if (!this.typeItem && !this.getInputType) {
          this.$message.warning('请选择格式再提交')
          return
        }
        if (!this.getInputType) {
          this.saveInputType(this.typeItem)
        }
        if (this.typeItem) {
          this.saveInputType(this.typeItem)
        }
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .styleIndent {
    margin-left: 32px;
  }
</style>
