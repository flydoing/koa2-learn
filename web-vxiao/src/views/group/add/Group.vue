<template>
  <Page title="创建群组" hasSubmit @submit="submit">
    <Avatar @success="logo">
      <Item>
        <div>封面</div>
        <div slot="remark">
          <img class="avatar big" v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}" alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item :hasClick="false">
      <div>群组名称</div>
      <input placeholder="必填" slot="remark" v-model="group.name" />
    </Item>
    <div class="category-title text" v-if="schools.length > 0">所属</div>
    <Item @click="campus(s,i)" v-for="(s,i) in schools" :key="s.id">
      <div>{{s.name}} {{s.campusName}}</div>
      <div slot="after">
        <i class="ico ico-select" :class="{'active':i===index}" />
      </div>
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import { mapActions } from 'vuex'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        index: -1,
        schools: [],
        group: {
          parentId: '',
          logo: '',
          name: '',
          type: '1'
        }
      }
    },
    activated() {
      Api.getJoinSchool().then(res => {
        this.schools = res.schools
      })
    },
    methods: {
      ...mapActions(['addGroup']),
      submit() {
        this.addGroup({ groups: [this.group] }).then(res => {
          this.$message({ type: 'success', message: `${this.group.name} 添加成功` })
          this.routeBack(-2)
        })
      },
      logo(file) {
        this.$set(this.group, 'logo', file.id)
      },
      campus(s, i) {
        this.index = i
        this.$set(this.group, 'parentId', s.id)
        this.$set(this.group, 'campusId', s.campusId)
      }
    }
  }

</script>
