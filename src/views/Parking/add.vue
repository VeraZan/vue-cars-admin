<template>
  <div class="parking-add">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="停车场名称：" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域：" prop="area">
        <CityArea :cityAreaValue.sync="form.area" :mapLocation="true" @callback="callbackComponents" ref="cityArea" />
      </el-form-item>
      <el-form-item label="详细地址：" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="item in parking_type" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆：" prop="carsNumber">
        <el-input-number v-model="form.carsNumber" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="禁启用：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in parking_status" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置：">
        <div class="address-wrap">
          <Amap @callback="callbackComponents" ref="amap" :options="options_map" />
        </div>
      </el-form-item>        
      <el-form-item prop="lnglat">
        <el-input v-model="form.lnglat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :loading="button_loading" @click="onSubmit('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Amap from "../amap";
import CityArea from "@c/common/cityArea";
// API
import { ParkingAdd,ParkingDetailed,ParkingEdit } from "@/api/parking";
export default {
  name:"ParkingAdd",
  components:{ Amap,CityArea },
  data(){
    return{
      id:this.$route.query.id,
      parking_status: this.$store.state.config.parking_status,
      parking_type: this.$store.state.config.parking_type,
      form: {
        parkingName: "",
        area:"",
        address:"",
        carsNumber: 0,
        type: 2,
        status: true,
        lnglat: ""
      },
      rules: {
        parkingName: [
          { required: true, message: '请输入停车场名称', trigger: 'change' },
        ],
        carsNumber: [
          { required: true, message: "数量不能为空", trigger: 'change' },
          { type: 'number', message: '请输入数字'}
        ],
        area: [
          { required: true, message:'请选择区域', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' },
        ],
        lnglat: [
          { required: true, message:'经纬度不能为空', trigger: 'change' }
        ]
      },
      // 按钮加载
      button_loading: false,
      options_map:{
        mapLoad:true
      }
    }
  },
  methods:{
    getLngLatValue(data){
      this.form.lnglat = data.lnglat.value;
    },
    callbackComponents(params){
      if(params.function){
        this[params.function](params.data);
      };
    },
    setMapCenter(data){
      if(this.$refs.amap) this.$refs.amap.setMapCenter(data.address);
    },
    onSubmit(formName){
      this.button_loading = true;
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.id ? this.editParking() : this.addParking();
        }else {
          this.button_loading = false;
          return false;
        }
      });
    },   
    /** 新增停车场API */
    addParking(){
      this.button_loading = true;
      ParkingAdd(this.form).then(response => {
        this.$message.success(response.message);
        this.button_loading = false;
        this.reset("form");
      }).catch(error => {
        this.button_loading = false;
      })
    },
    /** 修改停车场API */
    editParking(){
      let requestData = JSON.parse(JSON.stringify(this.form));
      requestData.id = this.id;
      this.button_loading = true;
      ParkingEdit(requestData).then(response => {
        this.$message.success(response.message);
        this.button_loading = false;
        this.$router.push({
            name: "ParkingIndex"
        })
      }).catch(error => {
        this.button_loading = false;
      })
    },
    reset(formName){
      this.$refs[formName].resetFields();
      // 清除 cityArea 的值 
      this.$refs.cityArea.clear();
      // 清除地图覆盖物
      this.$refs.amap.clearMarker();
    },
    getDetailed(){
      ParkingDetailed({id:this.id}).then(response => {
        const data = response.data;
        Object.keys(this.form).forEach(item => {
          if(data[item] !== undefined && data[item] !== null) this.form[item] = data[item];
        })
        const lnglat_arr = data.lnglat.split(",");
        const lnglat = {
          lng:lnglat_arr[0],
          lat:lnglat_arr[1]
        };
        this.$refs.amap.setMarker(lnglat);
        this.$refs.cityArea.initDefault(data.region);
      })
    },
    mapLoad(){
      if(!this.id) return false;
      this.getDetailed();
    }
  },
  beforeMount(){
    
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