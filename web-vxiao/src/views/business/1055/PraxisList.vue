<template>
  <div class="praxis-list">
    <!--type 1单选、2多选、3长文本 11短文本 -->
    <div v-for="(question, index) in questions"
         :key="index">
      <div class="category-title text"></div>
      <div class="praxis-item">
        <div v-if="question.type==='1' || question.type==='2'">
          <p class="praxis-title title"
             v-if="question.type==='1'">{{index+1}} 【单选题】{{question.title}}</p>
          <p class="praxis-title title"
             v-else>{{index+1}} 【多选题】{{question.title}}</p>
          <div class="images-block"
               v-if="question.medias && question.medias.length>0">
            <!-- <template v-if="image.type==='photo'"> -->
            <div class="image-box"
                 v-for="(image, j) in question.medias"
                 :key="j"
                 :style="bgImage(image)"></div>
            <!-- </template> -->
          </div>
          <div class="medias-block"
               v-if="question.medias && question.medias.length>0">
            <!-- <template v-if="file.type==='file'"> -->
            <a :href="url(file.fileId)"
               class="file-block f12 has-click"
               v-for="(file,i) in question.medias"
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
          <ul class="praxis-options"
              v-if="question.options.length>0">
            <!-- 选项 -->
            <div v-for="(option, o) in question.options"
                 :key="o"
                 class="praxis-option"
                 :class="{'selected': option.selected}"
                 @click="handleSelect(question, o, index)">
              <div class="option-serial">{{question.options.length>10?(o+1):'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(o)}}、</div>
              <div class="option-content">
                <div class="option-content-text">{{option.content}}</div>
                <div class="option-content-medias">
                  <div class="images-block"
                       v-if="option.medias && option.medias.length>0">
                    <!-- <template v-if="image.type==='photo'"> -->
                    <div class="image-box"
                         v-for="(image, j) in option.medias"
                         :key="j"
                         :style="bgImage(image)"></div>
                    <!-- </template> -->
                  </div>
                  <div class="medias-block"
                       v-if="option.medias && option.medias.length>0">
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
          </ul>
        </div>
        <div v-else>
          <p class="praxis-title title"
             v-if="question.type==='3'">{{index+1}} 【长文本】{{question.title}}</p>
          <p class="praxis-title title"
             v-else>{{index+1}} 【短文本】{{question.title}}</p>
          <div class="images-block"
               v-if="question.medias && question.medias.length>0">
            <div class="image-box"
                 v-for="(image, j) in question.medias"
                 :key="j"
                 :style="bgImage(image)"></div>
          </div>
          <div class="medias-block"
               v-if="question.medias && question.medias.length>0">
            <a :href="url(file.fileId)"
               class="file-block f12 has-click"
               v-for="(file,i) in question.medias"
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
          <template v-if="status!==3">
            <TextInput v-model="question.options[0].answerContent" />
            <!--  <SimpleUeditor :tools="[]" id="'editor'+ index" :noBottom="true" :content="question.options[0].answerContent || ''" :disabledBol="disabled"></SimpleUeditor> -->
          </template>
          <template v-else>
            <TextInput v-model="question.options[0].content" />
            <!-- <SimpleUeditor :tools="[]" id="'editor'+ index" :noBottom="true" :content="question.options && question.options[0].content ? question.options[0].content : ''" @change="changeContent($event, question, index)"></SimpleUeditor> -->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import ArrayUtils from '@/utils/array'
  export default {
    name: 'PraxisList',
    props: {
      questions: {
        type: Array,
        default() {
          return []
        }
      },
      status: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        disabled: false,
        imagesArr: [],
        filesArr: []
      }
    },
    created() {
      if (this.status !== 3) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    methods: {
      ...mapActions(['savePersonalInfo']),
      handleSelect(question, index, qIndex) {
        if (this.status !== 3) {
          return false
        }
        const that = this
        let questionsObj = JSON.parse(JSON.stringify(that.personalInfo.enrollTable.questionnaire.questions))
        if (question.type === '1') {
          questionsObj[qIndex].options.forEach(option => {
            option.selected = false
          })
          questionsObj[qIndex].options[index].selected = true
        } else if (question.type === '2') {
          questionsObj[qIndex].options[index].selected ? (questionsObj[qIndex].options[index].selected = false) : (questionsObj[qIndex].options[index].selected = true)
        }
        that.savePersonalInfo({
          enrollTable: {
            ...that.personalInfo.enrollTable,
            questionnaire: {
              ...that.personalInfo.enrollTable.questionnaire,
              questions: questionsObj
            }
          }
        })
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
      changeContent(str, question, i) {
        const that = this
        let questionsObj = [...that.personalInfo.enrollTable.questionnaire.questions]
        question.options[0].content = str
        questionsObj[i] = question
        that.savePersonalInfo({
          enrollTable: {
            ...that.personalInfo.enrollTable,
            questionnaire: {
              ...that.personalInfo.enrollTable.questionnaire,
              questions: questionsObj
            }
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        personalInfo: 'getPersonalInfo'
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
  .praxis-title.title {
    padding-bottom: rem(5);
    border-bottom: rem(1) solid #f9f9f9;
  }
  .praxis-option {
    position: relative;
    &.selected:after {
      content: '';
      width: rem(5);
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #00c162;
    }
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
    cursor: pointer;
  }

  .selected {
    border: 2px solid #00c162;
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
</style>
