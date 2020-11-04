<template>
  <el-dialog 
    :title="this.id ? '编辑租车类型':'新增租车类型'"
    class="cars-dialog-center" 
    :visible.sync="dialog_visible" 
    :close-on-click-modal="false" 
    @opened="opened" 
    @close="close"
  >
    <VueForm 
      ref="vuForm" 
      :formItem="form_item" 
      :formData="form_data" 
      :formHandler="form_handler" 
      labelWidth="120px"
    >     
    </VueForm>
  </el-dialog>
</template>

<script>
import VueForm from "@c/form";
import { LeaseAdd,LeaseEdit } from "@/api/lease";
export default {
  name:"AddCarsAttr",
  components:{ VueForm },
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    },
    id:{
      type:String,
      default:""
    },
    data:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      dialog_visible:false,
      form_data:{
        carsLeaseTypeName: "",
        carsLeaseStatus: true,
        carsLeaseDesc:""
      },
      form_item:[
        { 
          type:"Input",
          label:"租赁类型",
          prop:"carsLeaseTypeName",
          required:true,
        },
        { 
          type:"Radio",
          label:"禁启用状态",
          prop:"carsLeaseStatus",
          options:this.$store.state.config.radio_disabled,
          required:true,
        },
        { 
          type:"Textarea",
          label:"描述",
          prop:"carsLeaseDesc"
        }
      ],
      form_handler:[
        { label:"确定",key:"submit",type:"danger", handler: () => this.submit()  }
      ]
    }
  },
  methods:{
    submit(){
      this.$refs.vuForm.$refs.form.validate((valid) => {
        if(valid) {
          this.id ? this.edit() : this.add();
        }else {
          return false;
        }
      });   
    },
    add(){     
      LeaseAdd(this.form_data).then(response => {
        this.$message.success(response.message);
        this.close();
        this.$store.commit("common/SET_TABLE_DATA_FLAG");
      })
    },
    edit(){     
      LeaseEdit({ ...this.form_data,carsLeaseTypeId:this.id }).then(response => {
        this.$message.success(response.message);
        this.close();
        this.$store.commit("common/SET_TABLE_DATA_FLAG");
      })
    },
    reset(){
      this.$refs.vuForm.resetForm();
    },
    close(){
      this.reset();
      this.dialogVisible = false;
      this.$emit("update:flagVisible",false);    
      this.$emit("update:id","");  
      this.$emit("update:data",{});  
    },
    opened(){
      this.getDetailed()
    },
    getDetailed(){    
      if(!this.id) { return false; }  
      if(Object.keys(this.data).length !== 0){
        for(let item in this.form_data){
          this.form_data[item] = this.data[item];
        }
      }
    }
  },
  watch:{
    flagVisible:{
      handler(newValue,oldValue){
        this.dialog_visible = newValue;
      }
    }
  },
  beforeMount(){
    
  }
}
</script>

<style lang="scss">

</style>