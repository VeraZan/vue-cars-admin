<template>
  <div>
    <!-- <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="车辆品牌">
              <el-input v-model="form.brand"></el-input>
            </el-form-item>           
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button type="danger" class="pull-right" @click="dialogFormVisible = true">新增车辆品牌</el-button>
        </el-col>
      </el-row>
    </div> -->
    <!-- 表格数据 -->
    <TableData :config="table_config" ref="table">
      <template v-slot:status="slotData">
        <el-switch 
          v-model="slotData.data.status" 
          @change="switchChange(slotData.data)" 
          :disabled="slotData.data.id == switch_disabled_id"
          active-color="#13ce66" 
          inactive-color="#ff4949"
        > 
        </el-switch>      
      </template>   
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="edit(slotData.data.id)">编辑</el-button>       
      </template>
    </TableData>
    <AddCarsBrand :flagVisible.sync="dialogFormVisible" :id.sync="data_id" @callback="callbackComponent" />
  </div>
</template>

<script>
import TableData from "@c/tableData";
import AddCarsBrand from "@c/dialog/addCarsBrand";
import { BrandStatus,BrandDelete } from "@/api/brand";
export default {
  name:"CarsBrandIndex",
  components:{ TableData,AddCarsBrand },
  data(){
    return{
      dialogFormVisible: false,
      data_id: "",
      switch_disabled_id: "",
      delete_disabled_id: "",
      table_config: {
        thead: [
          { 
            label: "LOGO", 
            prop: "imgUrl",
            type: "image",
            imgWidth: 50,
            width:80
          },
          { 
            label: "车辆品牌", 
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => `${row.nameCh}/${row.nameEn}`
          },
          { 
            label: "禁启用", 
            prop: "status",
            type: "slot",
            slotName: "status",
            width:80 
          },
          { 
            label: "操作",
            type: "operation",          
            default: {
              deleteButton: true
            },
            slotName: "operation",
            width: 150,
            fixed: "right" 
          }
        ],
        url: "brandList",
        data:{
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"车辆品牌",prop:"brand",type:"Input" }
        ],
        form_handler: [
          { label: "新增车辆品牌", prop: "add", type: "danger", element: "button", handler: () => this.dialogFormVisible = true }
        ],
        form_config: {
          resetButton: true,
          formCol:18,
          handlerCol:6
        }
      }
    }
  },
  methods:{
    callbackComponent(params){
      if(params.function) { this[params.function](); }
    },
    //搜索
    search(){
      const requestData={
        pageSize:10,
        pageNumber:1
      };
      if(this.form.brand) requestData.brand = this.form.brand;
      this.$refs.table.requestData(requestData);
    },
    switchChange(data){
      const requestData = {
        id:data.id,
        status:data.status
      };
      this.switch_disabled_id = data.id;
      BrandStatus(requestData).then(response => {
        this.$message.success(response.message);
        this.switch_disabled_id = "";
      }).catch(error => {
        this.switch_disabled_id = "";
      })
    },
    // 编辑
    edit(id){
      this.dialogFormVisible = true;
      this.data_id = id;
    },
    //删除
    delConfirm(id){
      this.$confirm('确定删除此信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete_disabled_id = id;
        BrandDelete({id:id}).then(response => {
          this.$message.success(response.message);
          this.$refs.table.requestData();
          this.delete_disabled_id = "";
        }).catch(error => {
          this.delete_disabled_id = "";
        })
      }).catch(() => {});
    },
  }
}
</script>

<style lang="scss" scoped>

</style>