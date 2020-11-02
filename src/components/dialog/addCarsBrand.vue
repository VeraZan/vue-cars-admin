<template>
  <el-dialog 
  :title="this.id ? '编辑' : '新增'" 
  class="cars-dialog-center" 
  :visible.sync="dialogVisible" 
  :close-on-click-modal="false"
  @close="close"
  @opened="opened"
  >
    <VueForm ref="vuForm" :formItem="form_item" :formData="form_data" :formHandler="form_handler" labelWidth="120px">
      <template v-slot:logo>
        <div class="upload-img-wrap">
          <div class="upload-img">
            <img v-show="logo_current" :src="logo_current">
          </div>
          <ul class="img-list">
            <li v-for="item in logo" :key="item.id">
              <img :src="item.img" alt="item.name" @click="logo_current = item.img">
            </li>
          </ul>
        </div>
      </template>
    </VueForm>
  </el-dialog>
</template>

<script>
import { BrandLogo,BrandAdd,BrandDetailed,BrandEdit } from "@/api/brand";
import VueForm from "@c/form";
export default {
  name:"AddCarsBrand",
  components:{ VueForm },
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    },
    id:{
      type:String,
      default:""
    }
  },
  data(){
    return{
      dialogVisible:false,
      logo_current:"",
      logo:[],
      brand_status: this.$store.state.config.radio_disabled,
      form_data:{
        nameCh: '',
        nameEn: '',
        imgUrl: '',
        status: true,
        content: ''
      },
      form_item:[
        { 
          type:"Input",
          label:"品牌中文",
          prop:"nameCh",
          required:true,
        },
        { 
          type:"Input",
          label:"品牌英文",
          prop:"nameEn",
          required:true,
        },
        { type:"Slot",slotName:"logo",label:"LOGO"},
        { 
          type:"Radio",
          label:"禁启用",
          prop:"status",
          options:this.$store.state.config.radio_disabled,
          value:true
        }
      ],
      form_handler:[
        { label:"确定",key:"submit",type:"danger", handler: () => this.submit()  }
      ]
    }
  },
  methods:{
    opened(){
      this.getBrandLogo();
      this.getDetailed();
    },
    getBrandLogo(){
      if(this.logo.length !== 0) return false;
      BrandLogo().then(response => {
        this.logo = response.data;
      })
    },
    getDetailed(){
      if(this.id){
        BrandDetailed({id:this.id}).then(response => {
          const data = response.data;
          if(data){
            Object.keys(this.form_data).forEach(item => {
              if(data[item] !== undefined && data[item] !== null) this.form_data[item] = data[item];
            })
            this.logo_current = this.form_data.imgUrl;
          }
        })
      }  
    },
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
      this.form_data.imgUrl = this.logo_current;
      BrandAdd(this.form_data).then(response => {
        this.$message.success(response.message);      
        this.close();    
        this.$emit("callback", {
          function: "search"
        })
      })
    },
    edit(){
      this.form_data.imgUrl = this.logo_current;
      let requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      BrandEdit(requestData).then(response => {
        this.$message.success(response.message);
        this.close();   
        this.$emit("callback", {
          function: "search"
        })  
      })
    },
    reset(formName){
      this.$refs.vuForm.$refs[formName].resetFields();
      this.logo_current = "";
    },
    close(){
      this.reset("form");
      this.dialogVisible = false;
      this.$emit("update:flagVisible",false);
      this.$emit("update:id","");
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

<style>

</style>