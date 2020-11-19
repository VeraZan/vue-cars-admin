<template>
  <el-dialog 
    :title="title" 
    class="cars-dialog-center" 
    width="300px" 
    :visible.sync="dialogVisible" 
    @close="close"
    @open="open" 
    v-dialogDrag
  >
    <template v-if="img.length > 0">
      <img class="img-list" v-for="(item,index) in img" :key="index" :src="item">
    </template>
    <template v-else>
      <p>暂无可供展示的认证图片！</p>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name:"RealPhoto",
  props:{
    flagVisible:{
      type:Boolean,
      default:false
    },
    title:{
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
      dialogVisible:false,   
      img:[]  
    }
  },
  methods:{
    open(){
      let imgArr = [];
      for(let key in this.data){
        this.data[key] && imgArr.push(this.data[key]);
      }
      this.img = imgArr;
    },  
    close(){
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

<style lang="scss" scoped>
.img-list{
  width:100%;
  height:auto;
  margin-bottom:10px;
  &:last-child{
    margin-bottom:0;
  }
}
</style>