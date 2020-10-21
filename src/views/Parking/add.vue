<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="停车场名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="区域">
        <CityArea :cityAreaValue.sync="form.area" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="室外"></el-radio>
          <el-radio label="室内"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆">
        <el-input type="number" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-radio-group v-model="form.resource">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置">
        <div class="address-wrap">
          <Amap />
        </div>
      </el-form-item>        
      <el-form-item>
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Amap from "../amap";
import CityArea from "@c/common/cityArea";
export default {
  name:"ParkingAdd",
  components:{ Amap,CityArea },
  data(){
    return{
      form: {
        area:"",
        name: '',
        value: [],
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods:{
    submit(){
      // console.log(this.form.area);
    }
  }
}
</script>

<style lang="scss" scoped>
.address-wrap{
  width:100%;
  height:350px;
  //border:1px solid #ccc;
}
</style>