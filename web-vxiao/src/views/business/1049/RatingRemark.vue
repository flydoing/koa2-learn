<template>
  <Dialogs :visible.sync="visible" ref="_dialog_list">
    <DialogPage :title="title" name="create" :hasReturn="false" :hasClose="false">
      <div slot="button" class="return-Icon left" @click="handleReturn"></div>
      <div slot="button" class="right-Icon right" @click="handleSubmit"></div>
      <div v-if="isRemark">
        <item v-if="forProject" @click="handleClass">
          <div slot="main">班级</div>
          <div slot="remark">{{itemName}}</div>
        </item>
        <item v-else @click="handleProject">
          <div slot="main">项目</div>
          <div slot="remark">{{itemName}}</div>
        </item>
      </div>
      <div v-else>
        <item :hasClick="false">
          <div slot="main">分值</div>
          <input slot="remark" class="align-right" :placeholder="sPlaceholder" v-model="score" />
        </item>
      </div>
      <div>
        <TextInput placeholder="输入内容" v-model="remark"></TextInput>
      </div>
    </DialogPage>
    <DialogPage :title="listTitle" name="selectProject" :hasReturn="false" :hasClose="false">
      <div slot="button" class="return-Icon left" @click="handleProjectReturn"></div>
      <item v-for="(v,i) in list" :key="i" :v="v" @click="handleSelect(v, i)">
        <div slot="before">
          <i class="ico ico-select" :class="{'active':v.active}"></i>
        </div>
        <div slot="main" v-html="v.name"></div>
        <div slot="after"></div>
      </item>
    </DialogPage>
  </Dialogs>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      item: { type: [Object] },
      way: { type: [Object] },
      isRemark: { type: [Boolean] },
      items: { type: [Array] },
      forProject: { type: [Number] }
    },
    data() {
      return {
        visible: this.show,
        score: '',
        remark: '',
        list: [],
        curItem: null,
        listTitle: ''
      }
    },
    created() {
      this.initData()
    },
    computed: {
      title() {
        return this.isRemark ? '添加备注' : '评分'
      },
      itemName() {
        return this.curItem ? this.curItem.name : ''
      },
      sPlaceholder() {
        if (this.item) {
          let rule = this.item.rule
          return `输入${rule.minPoint}至${rule.maxPoint}的分值`
        }
        return ''
      }
    },
    methods: {
      initData() {
        this.list = this.items.map(v => {
          if (this.curItem && this.curItem.id === v.id) {
            v.active = true
          } else {
            v.active = false
          }
          return v
        })
      },
      handleReturn() {
        this.$emit('update:show', false)
      },
      handleSubmit() {
        if (this.isRemark) {
          if (this.forProject && !this.curItem) {
            this.$message({ message: '请选择班级', type: 'warning' })
            return false
          } else if (!this.curItem) {
            this.$message({ message: '请选择项目', type: 'warning' })
            return false
          }
          this.$emit('submit', {
            remark: this.remark,
            item: this.curItem
          })
        } else {
          let rule = this.item.rule
          if (Check.isNullString(this.score)) {
            this.$message({ message: '分值不能为空', type: 'warning' })
            return false
          }
          if (parseFloat(this.score) < rule.minPoint || parseFloat(this.score) > rule.maxPoint) {
            this.$message({ message: `请输入正确的分值（${rule.minPoint}至${rule.maxPoint}分）`, type: 'warning' })
            return false
          }
          this.$emit('submit', {
            score: this.score,
            remark: this.remark,
            item: this.item
          })
        }
      },
      handleProject() {
        this.listTitle = '选择项目'
        this.initData()
        this.$refs._dialog_list.showDialog('selectProject')
      },
      handleClass() {
        this.listTitle = '选择班级'
        this.initData()
        this.$refs._dialog_list.showDialog('selectProject')
      },
      handleProjectReturn() {
        this.$refs._dialog_list.showDialog('create')
      },
      handleSelect(item, index) {
        this.curItem = item
        this.$refs._dialog_list.showDialog('create')
      }
    },
    watch: {
      show(val) {
        this.visible = val
        this.score = ''
        this.remark = ''
        this.initData()
      }
    }
  }

</script>
<style scoped></style>
