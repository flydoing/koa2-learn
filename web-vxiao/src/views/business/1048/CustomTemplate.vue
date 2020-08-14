<template>
  <page title="自定义表彰模板">
    <div class="custom-template"
         @click="handle">
      <div class="category-title text">背景模板</div>
      <div class="template-list"
           v-loading="loading"
           element-loading-text="图片上传中">
        <div class="tl-content">
          <div class="tl-item"
               v-for="(item,i) in tList"
               :key="i"
               :item="item">
            <div v-if="item.isRemove"
                 @click="handleRemoveTemplate(item, i)">
              <i class="ico ico-delete" />
            </div>
            <img :src="Image.IMG_EMPTY"
                 v-lazy:background-image="item.logo"
                 :style="imageStyle(item.logo)" />
          </div>
          <el-upload class="inline-element"
                     :action="uploadURL"
                     :show-file-list="false"
                     :on-success="uploadSuccess"
                     :before-upload="beforeUpload">
            <div v-if="!isRemove"
                 class="tl-btn-add"
                 v-lazy:background-image="addIcon"
                 :style="imageStyle(addIcon)"></div>
          </el-upload>
          <div v-if="!isRemove"
               class="tl-btn-remove"
               v-lazy:background-image="removeIcon"
               :style="imageStyle(removeIcon)"
               @click.stop="templateRemove()"></div>
        </div>
        <div class="remark">注：建议模板图片尺寸为1920x1080</div>
      </div>
      <div class="category-title text">颁奖词</div>
      <div class="award-list">
        <div class="al-item"
             v-for="(item,i) in aList"
             :key="i"
             :item="item"
             @click="handleAward(item, i)"
             v-html="item.name"></div>
        <item @click="handleAddAward">
          <div slot="before">
            <i class='ico ico-plus' />
          </div>
          <div slot="main">颁奖词</div>
          <div slot="after"></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {},
    data() {
      return {
        addIcon: require('images/ico/ico_medal_add.png'),
        removeIcon: require('images/ico/ico_medal_remove.png'),
        tList: [],
        aList: [],
        isRemove: false,
        loading: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setCommend']),
      fetchData() {
        let that = this
        Api.loadTemplates(that.currentGroup.groupId).then(res => {
          that.tList = res.categorys.map(c => {
            c.isRemove = false
            c.logo = that.url(c.logo)
            return c
          })
        })

        CategoryApi.getCategorys({
          type: '142',
          groupId: that.currentGroup.groupId
        }).then(res => {
          that.aList = res.categorys
        })
      },
      handle() {
        this.isRemove = false
        this.refreshList(false)
      },
      uploadSuccess(res, file, fileLlist) {
        let that = this
        CategoryApi.addCategory([
          {
            groupId: that.currentGroup.groupId,
            remark: '1',
            name: '表彰模板',
            logo: res.file.id,
            type: '94'
          }
        ]).then(res => {
          that.tList.push({ ...res.categorys[0], logo: that.url(res.categorys[0].logo), isRemove: false })
          that.loading = false
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      refreshList(isRemove) {
        if (Check.isArray(this.tList)) {
          this.tList = this.tList.map(function(it) {
            it.isRemove = isRemove
            return it
          })
        }
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit5M = file.size / 1024 / 1024 < 5
        if (!limit5M) {
          this.$message({ message: '上传头像图片大小不能超过 5MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = true
      },
      templateRemove() {
        this.isRemove = true
        this.refreshList(true)
      },
      handleRemoveTemplate(item, index) {
        let that = this
        CategoryApi.addCategory([
          {
            id: item.id,
            status: 'd'
          }
        ]).then(res => {
          that.tList.splice(index, 1)
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleAward(item, index) {
        this.setCommend({ cache: item })
        this.routePush({ name: 'awardEdit1048' })
      },
      handleAddAward() {
        this.setCommend({ cache: null })
        this.routePush({ name: 'awardEdit1048' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .custom-template {
    .template-list {
      display: block;
      width: 100%;
      overflow: hidden;
      .tl-content {
        width: 110%;
      }
      .tl-item {
        display: inline-block;
        margin: rem(15) rem(2) 0 rem(13);
        vertical-align: middle;
        width: rem(313);
        height: rem(176);
        position: relative;
        img {
          width: rem(313);
          height: rem(176);
        }
      }
      .inline-element {
        display: inline-block !important;
      }
      .tl-btn-add,
      .tl-btn-remove {
        border: rem(1) solid #e8e8e8;
        display: inline-block;
        margin: rem(15) rem(2) 0 rem(13);
        vertical-align: middle;
        height: rem(126);
        width: rem(120);
        cursor: pointer;
        border-radius: rem(8);
        position: relative;
      }
    }

    .remark {
      margin: rem(10) rem(8);
    }
    .award-list {
      .al-item {
        padding: rem(10);
        text-align: justify;
        border-bottom: rem(1) solid #ebebeb;
        cursor: pointer;
      }
    }
  }

  .award-content {
    textarea {
      height: rem(200);
      text-align: justify;
      padding: rem(6) rem(8);
    }
  }
</style>
