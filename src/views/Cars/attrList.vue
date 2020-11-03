<template>
  <div>
    <TableData ref="table" :config="table_config">
      <template v-slot:otherContent>
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
      </template>
    </TableData>
    <AddCarsAttr :flagVisible.sync="dialog_show" :data="current_cars_attr_type" @callback="callbackComponent" />
  </div>
</template>
<script>
// 组件
import TableData from "@c/tableData";
import AddCarsAttr from "@c/dialog/addCarsAttr";
//api
import { GetCarsAttrTypeBasis } from "@/api/carsAttr";
export default {
  name: "CarAttr",
  components: { TableData,AddCarsAttr },
  data() {
    return {
      // 表格配置
      table_config: {
        isRequest:false,
        checkbox: false,
        pagination:false,
        thead: [
          { label: "字段", prop: "key",width:250 },        
          { label: "文本", prop: "value" }  
        ],
        url: "carsAttrList", 
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"关键字",type:"KeyWord",options:['key','value']}
        ],
        form_handler: [
          { label: "新增", prop: "add", type: "danger", element: "button", handler: () => this.carsAttrAddDialog() }
        ],
        form_config: {
          resetButton: true,
          formCol:21,
          handlerCol:3
        }
      },
      cars_attr_type_basis_list:[],
      current_cars_attr_type:{},
      dialog_show:false
    };
  },
  methods: {    
    callbackComponent(params){
      if(params.function) { this[params.function](); }
    },
    //获取车辆公共属性
    getCarsAttrTypeBasis(){
      return GetCarsAttrTypeBasis().then(response => {
        const data = response.data.data;
        this.cars_attr_type_basis_list = data;
        return data;
        //第一种做法
        // this.current_cars_attr_type = data[0];
        // this.getCarsAttrList();
      })
    },
    //第二种做法
    async getCarsType(){
      const data = await this.getCarsAttrTypeBasis();
      this.current_cars_attr_type = data[0];
      this.getCarsAttrList();
    },
    getTypeList(data){
      this.current_cars_attr_type = data;
      this.getCarsAttrList();
    },
    getCarsAttrList(){
      this.$refs.table.requestData({ typeId:this.current_cars_attr_type.id });
    },
    carsAttrAddDialog(){
      if(!this.current_cars_attr_type.id){
        this.$message.error("请选择车辆公共属性！");
        return false;
      }
      this.dialog_show = true
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    //第一种做法
    //this.getCarsAttrTypeBasis();
    //第二种做法
    this.getCarsType();
  },
  // DOM元素渲染完成（生命周期）
  mounted() {}
};
</script>
<style lang="scss" scoped>
.list-box{
  margin-bottom:17px;
  .el-button{
    margin-bottom:5px;
  }
}
</style>