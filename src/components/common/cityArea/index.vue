<template>
  <el-cascader 
    v-model="value" 
    :props="cascader_props" 
    @change="changeValue">
  </el-cascader>
</template>

<script>
import { GetCity } from "@/api/common";
export default {
  name:"CityArea",
  props:{
    cityAreaValue:{
      type:String,
      default:""
    },
		mapLocation: {
			type: Boolean,
			default: false
		}
  },
  data(){
    const _this = this;
    return{
      value:"",
      address:[],
      addressObj:{},
      cascader_props:{
        lazy: true,
        lazyLoad (node, resolve) {
          const level = node.level;
          const requestData = {};
          // 声明自定义配置
          const jsonType = {
            0: { type: "province" },
            1: { type: "city", code: "province" },
            2: { type: "area", code: "city" }
          }
          if(jsonType[level].code) { requestData[`${jsonType[level].code}_code`] = node.value }
          // type
          requestData.type = jsonType[level].type;
          GetCity(requestData).then(response=>{
            const data = response.data.data;
            const type = jsonType[level].type.toUpperCase();
            data.forEach(item => {
              item.value = item[`${type}_CODE`];
              item.label = item[`${type}_NAME`];
              // 最后一层选择
              if(level === 2) { item.leaf = level >= 2; }
            })
            _this.addressObj[jsonType[level].type] = data;
            resolve(data);
          })
          if(node.value !== 0){
            _this.getAddress(node);
          }
        }
      }
    }
  },
  methods:{
    changeValue(value){
      this.$emit("update:cityAreaValue",value.join());
      const areaCode = value[value.length -1];
      this.address[2] = this.addressObj.area.filter(item => item.value === areaCode)[0].label;
      this.getAddress();
    },
    // 获取中文地址
    getAddress(node){
      if(node){
        this.address[node.level - 1] = node.label;
      }
      if(this.mapLocation){
        this.$emit("callback",{
          function:"setMapCenter",
          data:{
            address:this.address.join("")
          }
        })
      }          
    },
    clear(){
			this.value = "";
		}
  }
}
</script>

<style>

</style>