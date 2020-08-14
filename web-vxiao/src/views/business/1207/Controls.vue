<template>
  <Page :title="title"
        :loading="loading">
    <Tabs theme="theme-1">
      <TabPane label="开关"
               name="off">
        <Scroller :height="scrollerHeight">
          <div v-for="(c,i) in categorys"
               :key="i">
            <div class="category-title"></div>
            <Item v-for="(viot,j) in c.viots"
                  :key="j"
                  @click="onViot(viot,c,j,i)">
              <div>{{viot.name}}</div>
              <div slot="after">
                <i-switch trueValue="1"
                          falseValue="0"
                          :value="viot.isopen"
                          @click="onViot(viot,c,j,i)"></i-switch>
              </div>
            </Item>
          </div>
        </Scroller>
      </TabPane>
      <TabPane label="模式"
               name="model">
        <div v-for="(viot,v) in viotStyles"
             :key="v">
          <Item @click="onModel(viot,viotStyles)">
            <div slot="main">{{viot.styleName}}</div>
            <div slot="after">
              <i-switch trueValue="1"
                        falseValue="0"
                        :value="viot.isopen"
                        @click="onModel(viot,viotStyles)"></i-switch>
            </div>
          </Item>
          <div class="categrory-title"></div>
        </div>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  export default {
    mixins: [R],
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        categorys: [],
        viotStyles: [],
        title: '物联网',
        loading: true,
        maxHeight: 200
      }
    },
    computed: {
      scrollerHeight() {
        return this.maxHeight - 52
      }
    },
    activated() {
      this.title = this.routeQuery('title') || '物联网设置'
      Api.getPlaceId(this.routeQuery('placeId'), this.currentGroup.parentId).then(res => {
        this.categorys = res.categorys || []
        this.viotStyles = res.viotStyles
        this.loading = false
      })
    },
    methods: {
      modifyViots(viots) {
        Api.potSwitchState({
          vIots: viots,
          placeId: this.routeQuery('placeId')
        })
      },
      onViot(viot, category, j, i) {
        // 如果是总控开关，则同级下面的开关需要跟着总控开关变化
        let isOpen = viot.isopen === '1' ? '0' : '1'
        let viots = []
        if (viot.isParent === '1') {
          category.viots.some(_viot => {
            this.$set(_viot, 'isopen', isOpen)
            if (viot.isParent !== '1') {
              viots.push(_viot)
            }
          })
          this.modifyViots(viots)
        } else {
          this.$set(viot, 'isopen', isOpen)
          // 当前是子级开关，如果当前是需要打开的状态，则需要同步打开总控开关
          // 否则，判断所有的子开关是否都是关闭，如果全部关闭，则也需要同步关闭总控开关
          if (isOpen === '1') {
            category.viots.some(_viot => {
              if (_viot.isParent === '1') {
                this.$set(_viot, 'isopen', isOpen)
                return true
              }
            })
          } else {
            // 先获取有打开的子开关，如果lenght 大于1，则不需要关闭总控
            let openViots = category.viots.filter(_viot => {
              return _viot.isParent !== '1' && _viot.isopen === '1'
            })
            if (openViots.length === 0) {
              category.viots.some(_viot => {
                if (_viot.isParent === '1') {
                  this.$set(_viot, 'isopen', isOpen)
                  // viots.push(_viot)
                  return true
                }
              })
            }
          }
          viots.push(viot)
          this.modifyViots(viots)
        }
      },
      onModel(viot, viots) {
        // 开启一个接口，关闭的时候也要调用一个接口
        let placeId = this.routeQuery('placeId')
        let styleId = viot.id
        if (viot.isopen === '1') {
          // 做关闭
          Api.getChoiceClose(placeId, styleId).then(res => {})
        } else {
          viots.forEach(_viot => {
            this.$set(_viot, 'isopen', '0')
          })
          this.$nextTick(() => {
            this.$set(viot, 'isopen', '1')
          })
          Api.getChoicePattern(placeId, styleId).then(res => {})
        }
      }
    }
  }
</script>
