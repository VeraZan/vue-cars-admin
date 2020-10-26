<template>
  <div class="parking-add">
    <VueForm ref="vuForm" :formItem="form_item" :formData="form_data" :formHandler="form_handler" labelWidth="120px">
      <template v-slot:city>
        <CityArea :cityAreaValue.sync="form_data.area" :mapLocation="true" @callback="callbackComponents" ref="cityArea" />      
      </template>
      <template v-slot:amap>
        <div class="address-wrap">
          <Amap @callback="callbackComponents" ref="amap" :options="options_map" />
        </div>
      </template>
    </VueForm>   
  </div>
</template>

<script>
import Amap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import VueForm from "@c/form";
// API
import { ParkingAdd,ParkingDetailed,ParkingEdit } from "@/api/parking";
export default {
  name:"ParkingAdd",
  components:{ Amap,CityArea,VueForm },
  data(){  
    return{
      form_data:{
        parkingName: "",
        area:"",
        address:"",
        carsNumber: 0,
        type: 2,
        status: true,
        lnglat: ""
      },
      form_item:[
        { 
          type:"Input",
          label:"停车场名称",
          placeholder:"请输入停车场名称",
          prop:"parkingName",
          width:"200px",
          required:true,
          //validator:[{ validator: validate_name_rules, trigger: 'blur' }]
        },
        { type:"Slot",slotName:"city",label:"区域",prop:"area",required:true,required_msg:"请选择区域"},
        { 
          type:"Input",
          label:"详细地址",
          placeholder:"请输入详细地址",
          prop:"address",
          required:true
        },
        { 
          type:"Radio",
          label:"类型",
          prop:"type",
          options:this.$store.state.config.parking_type,
          value:2
        },
        { 
          type:"InputNumber",
          label:"可停放车辆",
          prop:"carsNumber",
          required:true,
          rules:[{ type: 'number', message: '请输入数字'}],
          min:0,
          value:0
        },
        { 
          type:"Radio",
          label:"禁启用",
          prop:"status",
          options:this.$store.state.config.radio_disabled,
          value:true
        },
        { type:"Slot",slotName:"amap",label:"位置"},
        { type:"Input",prop:"lnglat",readonly:true,placeholder:"请在地图上选点",required_msg:"请在地图上选点"}
      ],
      form_handler:[
        { label:"确定",key:"submit",type:"danger", handler: () => this.formValidate()  }
      ],
      id:this.$route.query.id,
      // 按钮加载
      button_loading: false,
      options_map:{
        mapLoad:true
      }
    }
  },
  methods:{
    formValidate(){
      this.$refs.vuForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.editParking() : this.addParking();
        }
      });
    },
    getLngLatValue(data){
      this.form_data.lnglat = data.lnglat.value;
    },
    callbackComponents(params){
      if(params.function){
        this[params.function](params.data);
      };
    },
    setMapCenter(data){
      if(this.$refs.amap) this.$refs.amap.setMapCenter(data.address);
    },   
    /** 新增停车场API */
    addParking(){
      this.button_loading = true;
      ParkingAdd(this.form_data).then(response => {
        this.$message.success(response.message);
        this.button_loading = false;
        this.reset("form");
      }).catch(error => {
        this.button_loading = false;
      })
    },
    /** 修改停车场API */
    editParking(){
      let requestData = JSON.parse(JSON.stringify(this.form_data));
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
      this.$refs.vuForm.$refs[formName].resetFields();
      // 清除 cityArea 的值 
      this.$refs.cityArea.clear();
      // 清除地图覆盖物
      this.$refs.amap.clearMarker();
    },
    getDetailed(){
      ParkingDetailed({id:this.id}).then(response => {
        const data = response.data;
        Object.keys(this.form_data).forEach(item => {
          if(data[item] !== undefined && data[item] !== null) this.form_data[item] = data[item];
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