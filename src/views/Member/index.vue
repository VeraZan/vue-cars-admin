<template>
  <div>
    <!-- 表格数据 -->
    <TableData :config="table_config" ref="table">
      <template v-slot:realPhoto="slotData">
        <i class="el-icon-picture real-photo" @click="showPhoto(slotData)" title="查看认证图片"></i>
      </template>
    </TableData>
    <RealPhoto :flagVisible.sync="dialog_show" :title="dialog_title" :data="dialog_data" />
  </div>
</template>

<script>
import TableData from "@c/tableData";
import RealPhoto from "@c/dialog/realPhoto";
import { MemberBlacklist,MemberUpdateReal,MemberPhoto } from "@/api/member";
export default {
  name:"MemberList",
  components:{ TableData,RealPhoto },
  data(){
    return{
      dialog_show: false,
      dialog_title:"",
      dialog_data:{},
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
            handler:(data) => this.switchBlacklist(data),
            width:80 
          },   
          { 
            label: "实名认证", 
            prop: "check_real_name",
            type:"switch",
            handler:(data) => this.switchUpdateReal(data,"check_real_name","identity"),
            slotName:"realPhoto",
            width:100 
          },
          { 
            label: "驾驶证认证", 
            prop: "check_cars",
            type:"switch",
            handler:(data) => this.switchUpdateReal(data,"check_cars","drive"),
            slotName:"realPhoto",
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
    switchBlacklist(data){
      const requestData = {
        id:data.memberId,
        status:data.blacklist
      };
      MemberBlacklist(requestData).then(response => {
        this.$message.success(response.message);
      }).catch(error => {

      })
    },
    switchUpdateReal(data,key,type){
      const requestData = {
        id:data.memberId,
        status:data[key],
        type:type
      };
      MemberUpdateReal(requestData).then(response => {
        this.$message.success(response.message);
      }).catch(error => {

      })
    },
    showPhoto(data){
      const requestData = {
        id:data.data.memberId,
        type:data.prop === "check_real_name" ? "identity" : "drive"
      }
      MemberPhoto(requestData).then(response => {
        const data_photo = response.data;
        if(data_photo){
          this.dialog_data = data_photo;
          this.dialog_title = data.label;
          this.dialog_show = true;
        }else{
          this.$message.error("暂无可供展示的认证图片！");
        }
      })     
    }
  }
}
</script>

<style lang="scss" scoped>
.real-photo{
  margin-left: 8px;
  vertical-align: middle;
  color: #2f4357 ;
  cursor: pointer;
  &:hover{
    color:#0fa0e9;
  }
}
</style>