<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域：">
              <CityArea :cityAreaValue.sync="form.area" />
            </el-form-item>
            <el-form-item label="类型：">
              <el-select v-model="form.type" placeholder="请选择" clearable class="width-120">
                  <el-option v-for="item in parking_type" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用：">
              <el-select v-model="form.status" placeholder="请选择" clearable class="width-120">
                  <el-option v-for="item in parking_status" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-select v-model="search_key" clearable placeholder="请选择" class="width-120">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
                <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>                         
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
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
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData.data)">查看地图</el-button>    
      </template>
    </TableData>
    <ShowMapLocation :flagVisible.sync="map_show" :parking_data="parking_data" />
  </div>
</template>
<script> 
import CityArea from "@c/common/cityArea";
import TableData from "@c/tableData";
import ShowMapLocation from "@c/dialog/showMapLocation";
import { ParkingList,ParkingDelete,ParkingStatus } from "@/api/parking";
import { address,parkingType } from "@/utils/common";
export default {
  name: "Parking",
  components:{ CityArea,ShowMapLocation,TableData },
  data() {
    return {
      table_config:{
        thead: [
          { label: "停车场名称", prop: "parkingName",width:180 },
          { 
            label: "类型", 
            prop: "type",
            type: "function",
            callback: (row, prop) => parkingType(row[prop]),
            width:80
          },
          { 
            label: "区域",
            prop: "address",
            type: "function",          
            callback: (row, prop) => address(row[prop])
          },
          { label: "可停放车辆", prop: "carsNumber",width:100 },
          { 
            label: "禁启用", 
            prop: "status",
            type: "slot",
            slotName: "status",
            width:80 
          },
          { 
            label: "查看位置", 
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat",
            width: 110 
          },         
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              editButtonEvent:true,
              editButtonLink: "ParkingAdd"
            },
            width: 150,
            fixed: "right" 
          }
        ],
        url: "parkingList",
        data:{
          pageSize: 10,
          pageNumber: 1
        }
      },    
      search_key:"",
      keyword:"",
      switch_disabled_id:"",
      delete_disabled_id:"",
      map_show:false,
      parking_data:{},
      parking_status: this.$store.state.config.radio_disabled,
      parking_type: this.$store.state.config.parking_type,
      form: {
        status: "",
        area: "",
        type: "",
      }
    };
  },
  methods:{
    //查看地图
    showMap(data){
      this.map_show = true;
      this.parking_data = data;
    },
    //搜索
    search(){
      const requestData={
        pageSize:10,
        pageNumber:1
      };
      const filterData = JSON.parse(JSON.stringify(this.form));
      for(let key in filterData){
        if(filterData[key]){
          requestData[key] = filterData[key];
        }
      }
      if(this.search_key && this.keyword) { requestData[this.search_key] = this.keyword }
      this.$refs.table.requestData(requestData);
    },
    switchChange(data){
      const requestData = {
        id:data.id,
        status:data.status
      };
      this.switch_disabled_id = data.id;
      ParkingStatus(requestData).then(response => {
        this.$message.success(response.message);
        this.switch_disabled_id = "";
      }).catch(error => {
        this.switch_disabled_id = "";
      })
    },
    // 编辑
    edit(id){
      this.$router.push({
        name:"ParkingAdd",
        query:{
          id
        }
      })
    },
    //删除
    delConfirm(id){
      this.$confirm('确定删除此信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete_disabled_id = id;
        ParkingDelete({id:id}).then(response => {
          this.$message.success(response.message);
          this.$refs.table.requestData();
          this.delete_disabled_id = "";
        }).catch(error => {
          this.delete_disabled_id = "";
        })
      }).catch(() => {});
    }
  },
  beforeMount(){
    
  },
  mounted() {
    
  }
};
</script>
<style lass="scss" scoped>
</style>