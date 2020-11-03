<template>
  <el-dialog 
    title="新增租车类型"
    class="cars-dialog-center" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal="false"
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
import { LeaseAdd } from "@/api/lease";
export default {
  name:"AddCarsAttr",
  components:{ VueForm },
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      dialogVisible:false,
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
          this.add();
        }else {
          return false;
        }
      });   
    },
    add(){     
      LeaseAdd(this.form_data).then(response => {
        this.$message.success(response.message);
        this.reset();
      })
    },
    reset(){
      this.$refs.vuForm.resetForm();
    },
    close(){
      this.reset();
      this.dialogVisible = false;
      this.$emit("update:flagVisible",false);      
    }
  },
  watch:{
    flagVisible:{
      handler(newValue,oldValue){
        this.dialogVisible = newValue;
      }
    }
  }
}
</script>

<style lang="scss">

</style>