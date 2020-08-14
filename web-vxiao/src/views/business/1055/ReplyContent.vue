<template>
  <div id="reply-page">
    <page title="其他选项"
          hasSubmit
          @submit="handleSure">
      <div slot="main"
           class="praxis-box">
        <div class="praxis-list"
             v-if="praxisData.length>0">
          <div class="praxis-item"
               v-for="(praxis, p) in praxisData"
               :key="p"
               @click="editPraxis(praxis, p)">
            <div v-if="praxis.type=='1' || praxis.type=='2'">
              <!-- 单选 -->
              <div class="praxis-title">
                <div class="vx-item-show praxis-title-text"
                     v-if="praxis.type=='1'">{{p+1}}、【单选题】{{praxis.title}}</div>
                <div class="vx-item-show praxis-title-text"
                     v-else>{{p+1}}、【多选题】{{praxis.title}}</div>
                <div class="images-block"
                     v-if="praxis.medias&&praxis.medias.length>0">
                  <!-- <template v-if="image.type==='photo'"> -->
                  <div class="image-box"
                       v-for="(image, j) in praxis.medias"
                       :key="j"
                       :style="bgImage(image)"></div>
                  <!-- </template> -->
                </div>
                <div class="medias-block"
                     v-if="praxis.medias&&praxis.medias.length>0">
                  <!-- <template v-if="file.type==='file'"> -->
                  <a :href="url(file.fileId)"
                     class="file-block f12 has-click"
                     v-for="(file,i) in praxis.medias"
                     target="_blank"
                     :key="i">
                    <div class="logo">
                      <img :src="fileLogo(file)"
                           alt='附件'>
                    </div>
                    <div class="title">{{file.fileName}}</div>
                    <div class="remark"
                         v-text="conputedSize(file.size)"></div>
                  </a>
                  <!-- </template> -->
                </div>
              </div>
              <!-- 选项 -->
              <div v-for="(option, o) in praxis.options"
                   :key="o"
                   class="praxis-option">
                <div class="option-serial">{{praxis.options.length>10?(o+1):'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(o)}}、</div>
                <div class="option-content">
                  <div class="option-content-text">{{option.content}}</div>
                  <div class="option-content-medias">
                    <div class="images-block"
                         v-if="option.medias&&option.medias.length>0">
                      <!-- <template v-if="image.type==='photo'"> -->
                      <div class="image-box"
                           v-for="(image, j) in option.medias"
                           :key="j"
                           :style="bgImage(image)"></div>
                      <!-- </template> -->
                    </div>
                    <div class="medias-block"
                         v-if="option.medias&&option.medias.length>0">
                      <!-- <template v-if="file.type==='file'"> -->
                      <a :href="url(file.fileId)"
                         class="file-block f12 has-click"
                         v-for="(file,i) in option.medias"
                         target="_blank"
                         :key="i">
                        <div class="logo">
                          <img :src="fileLogo(file)"
                               alt='附件'>
                        </div>
                        <div class="title">{{file.fileName}}</div>
                        <div class="remark"
                             v-text="conputedSize(file.size)"></div>
                      </a>
                      <!-- </template> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="praxis.type=='3' || praxis.type=='11'">
              <!-- 长文本 -->
              <div class="praxis-title">
                <div class="vx-item-show praxis-title-text"
                     v-if="praxis.type=='3'">{{p+1}}、【长文本】{{praxis.title}}</div>
                <div class="vx-item-show praxis-title-text"
                     v-else>{{p+1}}、【短文本】{{praxis.title}}</div>
                <div class="images-block"
                     v-if="praxis.medias && praxis.medias.length>0">
                  <div class="image-box"
                       v-for="(image, j) in praxis.medias"
                       :key="j"
                       :style="bgImage(image)"></div>
                </div>
                <div class="medias-block"
                     v-if="praxis.medias && praxis.medias.length>0">
                  <a :href="url(file.fileId)"
                     class="file-block f12 has-click"
                     v-for="(file,i) in praxis.medias"
                     target="_blank"
                     :key="i">
                    <div class="logo">
                      <img :src="fileLogo(file)"
                           alt='附件'>
                    </div>
                    <div class="title">{{file.fileName}}</div>
                    <div class="remark"
                         v-text="conputedSize(file.size)"></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="category-title text"
               style="margin-top: 10px;"></div>
        </div>
        <item v-for="(item, index) in items"
              :key="index"
              @click="clickItem(item)">
          <div slot="main">{{item.name}}</div>
          <div slot="after">
            <i class="ico ico-plus"></i>
          </div>
        </item>
        <!-- <div class="commin-btn">
          <button @click="handleSure">确定添加</button>
        </div> -->
      </div>
    </page>
  </div>
</template>
<script>
  import Api from './api'
  import ArrayUtils from '@/utils/array'
  import { mapGetters } from 'vuex'
  export default {
    name: 'replyContent',
    created: function() {
      const praxisContent = [...this.question.enrollTable.questionnaire.questions]
      this.praxisData = praxisContent
      Api.queryBaseInfo().then(res => {
        if (res.code === '1') {
          this.items = res.categorys
        }
      })
    },
    data() {
      return {
        items: [],
        praxisData: [],
        OtherPNG: '/static/f/icon_query@2x.png'
      }
    },
    methods: {
      clickItem(item) {
        this.routePush({
          name: 'applyPraxisEdit',
          query: {
            type: item.value
          }
        })
      },
      handleSure() {
        this.routeBack()
      },
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
            file.extension
          )
        ) {
          return this.OtherPNG
        }
        return `/static/f/icon_${file.extension}@2x.png`
      },
      conputedSize(size) {
        if (size < 1024) {
          return size + 'Bytes'
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(2) + 'KB'
        } else if (size < 1024 * 1024 * 1024) {
          return (size / (1024 * 1024)).toFixed(2) + 'MB'
        }
      },
      bgImage(image) {
        if (image.type === 'photo') {
          return {
            'background-image': `url(${this.$store.state.FILE_URL}/${image.fileId}?thunb)`,
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center'
          }
        }
      },
      editPraxis(praxisObj, index) {
        let optionArr = []
        praxisObj.options.forEach(option => {
          optionArr.push({
            content: option.content,
            medias: option.medias
          })
        })
        this.routePush({
          name: 'applyPraxisEdit',
          query: {
            praxisData: {
              title: praxisObj.title,
              medias: praxisObj.medias,
              arr: optionArr
            },
            type: praxisObj.type,
            isEdit: true,
            praxisNum: index
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        question: 'getQuestion'
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .praxis-item {
    padding: rem(10) rem(10) 0;
    font-size: rem(14);
  }

  .images-block {
    padding: rem(10) 0;
    @include flex;
    .image-box {
      position: relative;
      margin-right: rem(10);
      width: rem(60);
      height: rem(60);
      cursor: pointer;
    }
  }

  .medias-block {
    padding-top: nth($padding, 1);
    .file-block {
      position: relative;
      display: block;
      @include flex;
      line-height: rem(45);
      background: nth($background, 9);
      margin-bottom: nth($padding, 3);
      .logo {
        flex: 1;
        img {
          display: block;
          width: rem(45);
          height: rem(45);
        }
      }
      .title {
        flex: 29;
        padding-left: nth($padding, 3);
      }
      .remark {
        flex: 1;
        padding-right: nth($padding, 3);
      }
    }
  }

  .praxis-option {
    padding: rem(10);
    @include flex;
    & > div {
      @include ct;
      @include jc;
      @include ai;
    }
    .option-serial {
      flex: 1;
    }
    .option-content {
      display: block;
      flex: 30;
    }
    &:hover {
      background: rgba(225, 225, 225, 0.3);
    }
    cursor: pointer;
  }

  .commin-btn {
    @include flex;
    button {
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      @include bch;
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bc;
      }
    }
  }
</style>
