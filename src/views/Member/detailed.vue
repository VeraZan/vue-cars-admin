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
      <label>预存违章金额：</label>
      <span>{{ data.illegalAmount }}</span>
    </li>
    <li>
      <label>黑名单：</label>
      <span>{{ data.blacklist ? "是" : "否" }}</span>
    </li>
    <li>
      <label>身份证（正面）：</label>
      <span>
        <img v-if="data.cardPhotoFace" :src="data.cardPhotoFace">
        <span class="text-muted" v-else>暂无</span>
        </span>
    </li>
    <li>
      <label>身份证（背面）：</label>
      <span>
        <img v-if="data.cardPhotoBack" :src="data.cardPhotoBack">
        <span class="text-muted" v-else>暂无</span>
      </span>
    </li>
    <li>
      <label>身份证（免冠）：</label>
      <span>
        <img v-if="data.cardPhotoBareheaded" :src="data.cardPhotoBareheaded">
        <span class="text-muted" v-else>暂无</span>
      </span>
    </li>
    <li>
      <label>驾驶证（正面）：</label>
      <span>
        <img v-if="data.carsPhotoFace" :src="data.carsPhotoFace">
        <span class="text-muted" v-else>暂无</span>
      </span>
    </li>
    <li>
      <label>驾驶证（背面）：</label>
      <span>
        <img v-if="data.carsPhotoBack" :src="data.carsPhotoBack">
        <span class="text-muted" v-else>暂无</span>
      </span>
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
  img{
    width:150px;
  }
  .text-muted{
    color:rgb(128, 128, 128);
  }
}
</style>