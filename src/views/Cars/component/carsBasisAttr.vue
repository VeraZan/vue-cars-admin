<template>
  <div>
     <div class="list-box">
      <el-button 
        v-for="item in cars_attr_type_basis_list" 
        size="small" 
        :type="current_cars_attr_type.id == item.id ? 'danger' : ''" 
        :key="item.id" 
        @click="getTypeList(item)"
      >
        {{ item.value }}
      </el-button>
    </div>
  </div>
</template>

<script>
//api
import { GetCarsAttrTypeBasis,GetCarsAttrList } from "@/api/carsAttr";
export default {
  name:"CarsBasisAttr",
  data(){
    return{
      cars_attr_type_basis_list:[],
      current_cars_attr_type:{}
    }
  },
  methods:{
    //获取公共属性
    getCarsAttrTypeBasis(){
     GetCarsAttrTypeBasis().then(response => {
        const data = response.data.data;
        this.cars_attr_type_basis_list = data;   
      })
    },
    getTypeList(data){
      this.current_cars_attr_type = data;
      this.getCarsAttrList();    
    },
    getCarsAttrList(){
      GetCarsAttrList({ typeId:this.current_cars_attr_type.id }).then(response => {
        this.$emit("getAttrList",{
          attr_basis_data: this.current_cars_attr_type,
          attr_data: response.data.data
        });
      })
    }
  },
  beforeMount() {
    this.getCarsAttrTypeBasis();
  },
}
</script>

<style lang="scss" scoped>
.list-box{
  margin-bottom:17px;
  .el-button{
    margin-bottom:5px;
  }
}
</style>