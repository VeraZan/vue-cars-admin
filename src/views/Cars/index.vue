<template>
  <div>
    <TableData ref="table" :config="table_config">
      <!--禁启用-->
      <template v-slot:status="slotData">
        <el-switch
          :disabled="slotData.data.id == switch_disabled"
          @change="switchChange(slotData.data)"
          v-model="slotData.data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
    </TableData>
  </div>
</template>
<script>
// 组件
import TableData from "@c/tableData";
// API
import { CarsStatus } from "@/api/cars";
// common
import { address, yearCheckType, energyType } from "@/utils/common";
export default {
  name: "Cars",
  components: { TableData },
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "车辆型号", prop: "carsMode",width:150 },
          { 
            label: "车辆品牌", 
            prop: "nameCh",
            width:150,
            type: "function",
            callback: (row, prop) => `${row.nameCh}/${row.nameEn}`
          },
          {
            label: "车辆LOGO",
            prop: "imgUrl",
            type: "image",
            width: 100
          },
          {
            label: "年检",
            prop: "yearCheck",
            type: "function",
            callback: (row, prop) => yearCheckType(row[prop])
          },
          {
            label: "能源类型",
            prop: "energyType",
            type: "function",
            callback: (row, prop) => energyType(row[prop])
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: 100
          },
          { label: "停车场", prop: "parkingName",width: 180 },
          {
            label: "区域",
            prop: "address",
            type: "function",
            width: 250,
            callback: (row, prop) => address(row[prop])
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              editButtonEvent:true,
              editButtonLink: "CarsAdd"
            },
            width: 150,
            fixed: "right" 
          }
        ],
        url: "carsList", // 真实URL请求地址
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"区域",prop:"area",type:"City" },
          { label:"类型",prop:"parkingType",type:"Select",width:"120px",options:"parking_type"},
          { label:"禁启用",prop:"status",type:"Select",width:"120px",options:"radio_disabled"},
          { label:"关键字",type:"KeyWord"}
        ]
      },
      switch_disabled: "",    
      // 地图显示
      map_show: false,
      parking_data: {}
    };
  },
  methods: {    
    /** 禁启用 */
    switchChange(data) {      
      const requestData = {
        id: data.id,
        status: data.status
      };
      this.switch_disabled = data.id; // 第一种方式：组件本身的属性处理
      CarsStatus(requestData).then(response => {
        this.$message.success(response.message);
        this.switch_disabled = "";
      }).catch(error => {
        this.switch_disabled = "";
      });
    },    
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {},
  // DOM元素渲染完成（生命周期）
  mounted() {}
};
</script>
<style lass="scss" scoped></style>