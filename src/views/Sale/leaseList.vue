<template>
  <div>
    <TableData ref="table" :config="table_config">
       <!--禁启用-->
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.carsLeaseStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
    </TableData>
    <AddLeaseType :flagVisible.sync="dialog_show" @callback="callbackComponent" />
  </div>
</template>
<script>
// 组件
import TableData from "@c/tableData";
import AddLeaseType from "@c/dialog/addLeaseType";
export default {
  name: "CarLease",
  components: { TableData,AddLeaseType },
  data() {
    return {
      // 表格配置
      table_config: {
        thead: [
          { label: "租车类型", prop: "carsLeaseTypeName",width:250 },        
          {
            label: "禁启用",
            prop: "carsLeaseStatus",
            type: "slot",
            slotName: "carsLeaseStatus"
          } 
        ],
        url: "leaseList", 
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"关键字",type:"KeyWord",options:['key','value']}
        ],
        form_handler: [
          { label: "新增", prop: "add", type: "danger", element: "button", handler: () => this.dialog_show = true }
        ],
        form_config: {
          resetButton: true,
          formCol:21,
          handlerCol:3
        }
      },
      dialog_show:false
    };
  },
  methods: {    
    callbackComponent(params){
      if(params.function) { this[params.function](); }
    }
  },
  // DOM元素渲染之前（生命周期）
  beforeMount() {
    
  },
  // DOM元素渲染完成（生命周期）
  mounted() {}
};
</script>
<style lang="scss" scoped>

</style>