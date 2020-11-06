<template>
  <div>
    <TableData ref="table" :config="table_config"></TableData>
    <AddLeaseType :flagVisible.sync="dialog_show" :id.sync="data_id" :data.sync="data_edit" @callback="callbackComponent" />
  </div>
</template>
<script>
// 组件
import TableData from "@c/tableData";
import AddLeaseType from "@c/dialog/addLeaseType";
import { LeaseStatus } from "@/api/lease";
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
            type: "switch",
            handler:(data) => this.switchChange(data)
          },       
          {
            label: "操作",
            type: "operation",   
            buttonGroup:[
              { label:"编辑",type:"danger",element:"button",handler:(data)=>this.edit(data)}
            ],
            width: 150,
            fixed: "right" 
          }
        ],
        url: "leaseList", 
        data: {
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"关键字",type:"KeyWord",options:['carsLeaseTypeName','carsNumber']}
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
      dialog_show:false,
      data_id:"",
      data_edit:{}
    };
  },
  methods: {    
    callbackComponent(params){
      if(params.function) { this[params.function](); }
    },
    // 编辑
    edit(data){
      this.dialog_show = true;
      this.data_id = data.carsLeaseTypeId;
      this.data_edit = data;
    },
    switchChange(data){
      const requestData = {
        id:data.carsLeaseTypeId,
        status:data.carsLeaseStatus
      };
      LeaseStatus(requestData).then(response => {
        this.$message.success(response.message);
      }).catch(error => {

      })
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