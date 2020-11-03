<template>
  <div>
    <CarsBasisAttr @getAttrList="getAttrList" />
    {{ countKm }}
    <el-row :gutter="10" class="attr-row">
      <el-col :span="8" v-for="item in attr_data" :key="item.key">
        <el-input 
          v-model="attr_item[attr_basis_data.key][item.key]" 
          :title="item.value" 
          :placeholder="item.value"
        >
          <template slot="prepend">{{ item.value }}</template>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//api
import CarsBasisAttr from "./carsBasisAttr";
export default {
  name:"CarsAttr",
  components:{ CarsBasisAttr },
  props:{
    initValue:{
      type:String,
      default:""
    },
    oil: {
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      attr_data:[],
      attr_basis_data:{},
      attr_item:{}
    }
  },
  computed:{
    countKm(){
      if(!this.attr_item.basics || !this.attr_item.basics.measuredFuelConsumption || 
      !this.attr_item.carsBody || !this.attr_item.carsBody.tankVolume){
        return "";
      }
      const surplusOil = this.oil * this.attr_item.carsBody.tankVolume / 100;
      const km = surplusOil / this.attr_item.basics.measuredFuelConsumption * 100;
      this.$emit("update:countKm",km.toFixed(2));
      //return km.toFixed(2);    
    }
  },
  methods:{
   getAttrList(data){
     this.attr_basis_data = data.attr_basis_data;
     this.attr_data = data.attr_data;
     this.attrFormat();
   },
   attrFormat(){
    if(this.attr_data.length === 0) return false;
    const attr_basis_key = this.attr_basis_data.key;
    if(this.attr_item[attr_basis_key]) return false;
    const attr_json = {};
    this.attr_data.forEach(item => {
      attr_json[item.key] = "";
    });
    //this.$set(Object, key, value),给对象添加新的属性并可以更新视图
    this.$set(this.attr_item,attr_basis_key,attr_json);
   },
   callbackValue(){
     this.$emit("update:value",JSON.stringify(this.attr_item));
   }
  },
  watch:{
    initValue:{
      handler(newValue,oldValue){
        newValue && (this.attr_item = JSON.parse(newValue));
      },
      immediate:true
    }
  },
  beforeMount() {
    
  }
}
</script>
<style lang="scss">
.attr-row {
  .el-col{
    margin-bottom:5px;
  }
  .el-input-group__prepend {
    width: 70px;
    max-width: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>