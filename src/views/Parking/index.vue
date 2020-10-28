<template>
  <div>
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
        },
        form_item:[
          { label:"区域",prop:"area",type:"City" },
          { label:"类型",prop:"parkingType",type:"Select",width:"120px",options:"parking_type"},
          { label:"禁启用",prop:"status",type:"Select",width:"120px",options:"radio_disabled"},
          { label:"关键字",type:"KeyWord",options:['parkingName','address']}
        ],
        form_handler: [
          { label: "新增", prop: "add", type: "danger", element: "link", router: "/parkingAdd" }
        ],
        form_config: {
          resetButton: true,
          formCol:21,
          handlerCol:3
        }
      },    
      search_key:"",
      keyword:"",
      switch_disabled_id:"",
      delete_disabled_id:"",
      map_show:false,
      parking_data:{}
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