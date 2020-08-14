<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit
        :hasClose="false"
        v-loading="loading">
    <div class="prize-edit">
      <item :hasClick="false">
        <div slot="main">奖品名称</div>
        <input slot="remark"
               placeholder="必填"
               v-model="thing.name" />
      </item>
      <item :hasClick="false">
        <div slot="main">所需积分</div>
        <input slot="remark"
               placeholder="必填"
               v-model="thing.integral" />
      </item>
      <item :hasClick="false">
        <div slot="main">每学期每人兑换上限</div>
        <input slot="remark"
               placeholder="必填"
               v-model="thing.exchangeLimit" />
      </item>
      <item :hasClick="false">
        <div slot="main">库存</div>
        <input slot="remark"
               placeholder="数量"
               v-model="thing.count" />
      </item>
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">奖品图片</div>
          <img slot="remark"
               class="pe-img"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </item>
      </el-upload>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        thing: {
          name: '',
          logo: '',
          score: '',
          integral: '',
          count: '',
          exchangeLimit: 100,
          sets: {}
        },
        loading: false
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        prize: 'getPrize'
      }),
      title() {
        return this.thing.id ? '编辑奖品' : '新建奖品'
      },
      logo() {
        return this.thing.logo ? this.url(this.thing.logo) : ''
      },
      remarkTxt() {
        let sets = this.thing.sets
        if (sets.period === '1') {
          return `每周补到${sets.level}件`
        } else if (sets.period === '2') {
          return `每月补到${sets.level}件`
        } else if (sets.period === '0') {
          return `关闭`
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setPrize']),
      fectchData() {
        let that = this
        let cache = that.prize.cache
        if (that.prize.thing) {
          that.thing = { ...that.prize.thing }
        } else if (cache) {
          that.thing = {
            ...cache,
            exchangeLimit: cache.exchangeLimit !== undefined ? cache.exchangeLimit : 100
          }
        }
      },
      uploadSuccess(res, file, fileLlist) {
        this.thing.logo = res.file.id
        this.loading = false
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 1
        if (!limit1M) {
          this.$message({ message: '上传头像图片大小不能超过 1MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = true
      },
      handleReplenishment() {
        this.setPrize({ thing: this.thing })
        this.routePush({ name: 'replenishSet1141' })
      },
      handleSubmit() {
        const that = this

        let thing = that.thing
        if (Check.isNullString(thing.name)) {
          that.$message({ message: '奖品名称不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(thing.integral)) {
          that.$message({ message: '所需分值不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(thing.count)) {
          that.$message({ message: '库存数量不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(thing.logo)) {
          that.$message({ message: '奖品图标不能为空', type: 'warning' })
          return false
        }
        if (!Check.isNumber(thing.exchangeLimit) || thing.exchangeLimit < 0) {
          that.$message({ message: '请输入大于等于0的整数（兑换上限）', type: 'warning' })
          return false
        }

        let postData = {
          groupId: that.currentGroup.groupId,
          name: thing.name,
          integral: thing.integral,
          count: thing.count,
          logo: thing.logo,
          opratorId: this.userId,
          exchangeLimit: parseInt(thing.exchangeLimit),
          schoolId: this.currentGroup.parentId,
          type: this.isSchool ? '1' : '3'
        }
        thing.id && (postData.id = thing.id)
        this.isClass && (postData.groupId = this.groupId)

        Api.commitPrize(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .prize-edit {
    .el-upload {
      display: block !important;
    }

    .pe-img {
      height: rem(50);
      margin: rem(5) rem(5) rem(5) 0;
    }
  }
</style>
