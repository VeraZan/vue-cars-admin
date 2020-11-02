<template>
  <div>
    <CarsBasisAttr @getAttrList="getAttrList" />
    <el-row :gutter="10">
      <el-col :span="8" v-for="item in cars_attr" :key="item.key">
        <el-input>
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
  data(){
    return{
      cars_attr:[]
    }
  },
  methods:{
   getAttrList(data){
     console.log(data)
     this.cars_attr = data;
   }
  },
  beforeMount() {
    
  },
}
</script>