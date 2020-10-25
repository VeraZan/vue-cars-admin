<template>
  <el-dialog 
  :title="this.id ? '编辑' : '新增'" 
  class="cars-dialog-center" 
  :visible.sync="dialogVisible" 
  :close-on-click-modal="false"
  @close="close"
  @opened="opened"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="品牌中文：" prop="nameCh">
        <el-input v-model="form.nameCh"></el-input>
      </el-form-item>
      <el-form-item label="品牌英文：" prop="nameEn">
        <el-input v-model="form.nameEn"></el-input>
      </el-form-item>
      <el-form-item label="LOGO：">
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
      </el-form-item>
      <el-form-item label="禁启用：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in brand_status" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>           
      <el-form-item label="描述：" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" :loading="button_loading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BrandLogo,BrandAdd,BrandDetailed,BrandEdit } from "@/api/brand";
export default {
  name:"AddCarsBrand",
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
      brand_status: this.$store.state.config.parking_status,
      button_loading: false,
      form: {
        nameCh: '',
        nameEn: '',
        imgUrl: '',
        status: true,
        content: ''
      },
      rules: {
        nameCh: [
          { required: true, message: '请输入品牌中文', trigger: 'change' },
        ],
        nameEn: [
          { required: true, message: '请输入品牌英文', trigger: 'change' },
        ]
      }
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
            Object.keys(this.form).forEach(item => {
              if(data[item] !== undefined && data[item] !== null) this.form[item] = data[item];
            })
            this.logo_current = this.form.imgUrl;
          }
        })
      }  
    },
    submit(){
      this.button_loading = true;
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.id ? this.edit() : this.add();
        }else {
          this.button_loading = false;
          return false;
        }
      });     
    },
    add(){
      this.form.imgUrl = this.logo_current;
      this.button_loading = true;
      BrandAdd(this.form).then(response => {
        this.$message.success(response.message);      
        this.reset("form");
        this.button_loading = false;
      }).catch(error => {
        this.button_loading = false;
      })
    },
    edit(){
      let requestData = JSON.parse(JSON.stringify(this.form));
      requestData.id = this.id;
      this.button_loading = true;
      BrandEdit(requestData).then(response => {
        this.$message.success(response.message);
        this.button_loading = false;  
        this.close();     
      }).catch(error => {
        this.button_loading = false;
      })
    },
    reset(formName){
      this.$refs[formName].resetFields();
      this.logo_current = "";
    },
    close(){
      this.reset("form");
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