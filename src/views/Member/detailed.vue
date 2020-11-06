<template>
  <ul class="detailed">
    <li>
      <label>用户名：</label>
      <span>{{ data.username }}</span>
    </li>
    <li>
      <label>真实姓名：</label>
      <span>{{ data.truename }}</span>
    </li>
    <li>
      <label>性别：</label>
      <span>{{ data.gender === 1 ? "男" : "女" }}</span>
    </li>
    <li>
      <el-button type="danger" @click="goback">返回</el-button>
    </li>
  </ul>
</template>

<script>
import { MemberDetailed } from "@/api/member";
export default {
  name:"MemberDetailed",
  data(){
    return {
      id:this.$route.query.id,
      data:{}
    }
  },
  methods:{
    detailed(){
      MemberDetailed({ id:this.id }).then(response => {
        this.data = response.data;
      })
    },
    goback(){
      this.$router.go(-1);
    }
  },
  beforeMount(){
    this.id && this.detailed();
  }
}
</script>

<style lang="scss" scoped>
.detailed li{
  display: flex;
  margin-bottom:15px;
  label{
    width:150px;
    font-weight: 600;
  }
  span{
    flex: 1;
  }
}
</style>