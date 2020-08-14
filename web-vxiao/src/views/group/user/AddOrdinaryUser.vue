<template>
  <div>
    <div v-for="(user,i) in users" :key="i">
      <Item class="full-input" :hasClick="false">
        <input slot="main" placeholder="手机号码" v-model="user.mobile" maxlength="11" />
      </Item>
      <Item class="full-input" :hasClick="false">
        <input slot="main" placeholder="姓名" v-model="user.name" />
      </Item>
      <div class="category-title" v-if="i< users.length-1"></div>
    </div>
    <div class="list-button">
      <div class="button big" @click="$emit('new')">再添加一位成员</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      users: { type: Array }
    }
  }

</script>
