<template>
  <Page title="新建缴费"
        closePrompt
        @submit="onSubmit"
        hasSubmit
        listenBack
        @back="onBack">
    <Item :hasClick="false">
      <div slot="main">名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="item.title" />
    </Item>
    <Item :hasClick="false">
      <div slot="main">金额</div>
      <input v-numbers="1"
             slot="remark"
             placeholder="必填"
             v-model="item.msgJson" />
    </Item>
    <el-popover placement="right-start"
                width="432"
                trigger="click"
                v-model="showTree">
      <Popover title="缴费对象"
               :th="400"
               :hasSubmit="true"
               @submit="onTreeSubmit">
        <el-tree :data="list"
                 show-checkbox
                 default-expand-all
                 check-on-click-node
                 node-key="id"
                 ref="tree"
                 highlight-current
                 :props="placeProps">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span v-html="data.name"></span>
          </span>
        </el-tree>
      </Popover>
      <item slot="reference">
        <div>缴费对象</div>
        <div slot="remark">{{item.toUsers.length}} 个班级</div>
      </item>
    </el-popover>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file', 'at', 'emoji', 'topic']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Numbers from '@/directives/number'
  export default {
    mixins: [R, MixinMessage],
    directives: { Numbers },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        showTree: false,
        list: [],
        item: {
          title: '',
          msgJson: 0,
          toUsers: []
        },
        placeProps: {
          children: 'classes',
          label: 'name'
        }
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        GroupApi.getSchoolGroupTree(that.currentGroup.parentId).then(res => {
          if (Check.isRealArray(res.groups)) {
            this.list.push({ name: '部门群组', classes: res.groups })
          }
          res.campuses.forEach(c => {
            this.list.push({
              classes: c.grades,
              ...c
            })
          })
        })
      },
      onTreeSubmit() {
        this.$set(this.item, 'toUsers', [])
        this.$refs.tree.getCheckedNodes().forEach(node => {
          if (node.type === '2' || node.type === '1') {
            this.item.toUsers.push({
              type: 'cc',
              name: node.name,
              groupId: node.groupId,
              userId: node.id,
              userType: 'class'
            })
          }
        })
        this.showTree = false
      },
      onSubmit() {
        if (Check.isNullString(this.item.title)) {
          this.$message({ type: 'warning', message: '缴费名称不能为空' })
          return
        }
        if (Check.isPointNumber(this.item.msgJson)) {
        }
        if (!Check.isRealArray(this.item.toUsers)) {
          this.$message({ type: 'warning', message: '缴费对象不能为空' })
          return
        }
        let m = this.constructionMessage({
          ...this.editorMessage,
          ...this.item,
          type: '1265',
          groupId: this.currentGroup.groupId
        })
        if (Check.isNullString(m.content)) {
          this.$message({ type: 'warning', message: '缴费内容不能为空' })
          return
        }
        this.addMessage(m).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.routeBack()
        })
      },
      onBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
