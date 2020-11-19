<template>
  <el-dialog 
    title="车辆自定义属性添加"
    class="cars-dialog-center" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal="false"
    @close="close" 
    v-dialogDrag
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
import { CarsAttrAdd } from "@/api/carsAttr";
export default {
  name:"AddCarsAttr",
  components:{ VueForm },
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    },
    data:{
      type:Object,
      default:() => {}
    }
  },
  data(){
    return{
      dialogVisible:false,
      form_data:{
        key: "",
        value: "",
        typeValue:""
      },
      form_item:[
        { 
          type:"Input",
          label:"当前属性",
          prop:"typeValue",
          disabled:true,
        },
        { 
          type:"Input",
          label:"字段",
          prop:"key",
          required:true,
        },
        { 
         type:"Input",
          label:"文本",
          prop:"value",
          required:true,
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
      const requestData = {
        typeId:this.data.id,
        key:this.form_data.key,
        value:this.form_data.value
      };
      CarsAttrAdd(requestData).then(response => {
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
      this.$emit("callback", {
        function: "getCarsAttrList"
      })
    }
  },
  watch:{
    flagVisible:{
      handler(newValue,oldValue){
        this.dialogVisible = newValue;
      }
    },
    data:{
      handler(newValue,oldValue){
        this.form_data.typeValue = newValue.value;
      }
    }
  }
}
</script>

<style lang="scss">

</style>