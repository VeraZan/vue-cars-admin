<template>
  <el-dialog 
  title="新增" 
  class="cars-dialog-center" 
  :visible.sync="dialogVisible" 
  :close-on-click-modal="false"
  @close="close"
  >
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="车辆品牌">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="品牌型号">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="LOGO">
        <div class="upload-img-wrap">
          <div class="upload-img"></div>
          <div class="img-list"></div>
        </div>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-radio-group v-model="form.user">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>           
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.user"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name:"AddCarsBrand",
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      dialogVisible:false,
      form: {
        user: '',
        region: ''
      },
    }
  },
  methods:{
    close(){
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

<style>

</style>