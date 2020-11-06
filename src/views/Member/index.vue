<template>
  <div>
    <!-- 表格数据 -->
    <TableData :config="table_config" ref="table"></TableData>
  </div>
</template>

<script>
import TableData from "@c/tableData";
import { MemberBlacklist } from "@/api/member";
export default {
  name:"MemberList",
  components:{ TableData },
  data(){
    return{
      table_config: {
        thead: [
          { 
            label: "用户名", 
            prop: "username",
            width:120
          },
          { 
            label: "真实姓名", 
            prop: "truename",
            width:120
          },
          { 
            label: "租车订单", 
            prop: "order"
          },
          { 
            label: "预存违章金额", 
            prop: "illegalAmount",
            width:120
          },
          {
            label: "黑名单",
            prop: "blacklist",
            type: "switch",
            handler:(data) => this.switchChange(data),
            width:80 
          },   
          { 
            label: "实名认证", 
            prop: "check_real_name",
            type:"function",
            callback:(row,prop) => {
              return row[prop] ? "已认证" : "-";
            },
            width:120 
          },
          { 
            label: "驾驶证认证", 
            prop: "check_cars",
            type:"function",
            callback:(row,prop) => {
              return row[prop] ? "已认证" : "-";
            },
            width:120 
          },
          { 
            label: "操作",
            type: "operation", 
            buttonGroup:[
              { label:"详情",type:"danger",element:"link",name:"MemberDetailed",key:"id",value:"memberId"},
              { label:"编辑",type:"danger",element:"link",name:"MemberEdit",key:"id",value:"memberId"}
            ],         
            default: {
              deleteButton: true,
              deleteKey:"memberId"
            },
            slotName: "operation",
            width: 220,
            fixed: "right" 
          }
        ],
        url: "memberList",
        data:{
          pageSize: 10,
          pageNumber: 1
        },
        form_item:[
          { label:"关键字",type:"KeyWord",options:['username','truename','card_id']}
        ],
        form_handler: [

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
    switchChange(data){
      const requestData = {
        id:data.memberId,
        status:data.blacklist
      };
      MemberBlacklist(requestData).then(response => {
        this.$message.success(response.message);
      }).catch(error => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>