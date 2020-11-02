<template>
  <el-form ref="form" :model="formData" :label-width="labelWidth">
    <el-form-item v-for="item in formItem" :label="item.label" :prop="item.prop" :key="item.prop" :rules="item.rules">
      <!-- 输入框 -->
      <el-input 
        v-if="item.type === 'Input'" 
        v-model.trim="formData[item.prop]" 
        :placeholder="item.placeholder" 
        :style="{ width:item.width }"       
        :readonly="item.readonly" 
        :disabled="item.disabled"
      ></el-input>
      <!-- 选择器 -->
      <el-select v-if="item.type === 'Select'" v-model="formData[item.prop]" filterable :placeholder="item.placeholder" :style="{ width:item.width }" >
        <el-option
          v-for="selectItem in item.options"
          :key="selectItem.value !== undefined ?  selectItem.value : selectItem[item.select_value]"
          :label="selectItem.label || selectItem[item.select_label]"
          :value="selectItem.value !== undefined ?  selectItem.value : selectItem[item.select_value]">
        </el-option>
      </el-select>
      <!-- 单选框 -->
      <el-radio-group v-if="item.type === 'Radio'" v-model="formData[item.prop]" >
        <el-radio 
          v-for="radio in item.options" 
          :label="radio.value" 
          :key="radio.value"
        >
          {{ radio.label }}
        </el-radio>
      </el-radio-group>
      <!-- 计数器 -->
      <el-input-number v-if="item.type === 'InputNumber'" v-model.trim="formData[item.prop]" :min="item.min" :max="item.max"></el-input-number>
      <!-- 省市区 -->
      <template v-if="item.type === 'City'">
        <CityArea ref="city" :cityAreaValue.sync="formData[item.prop]" />
      </template>    
      <!-- 富文本编辑器 -->
      <template v-if="item.type === 'Wangeditor'">
        <Wangeditor :isClear="wangeditorClear" ref="wangeditor" :value="formData[item.prop]" :content.sync="formData[item.prop]" />
      </template>
      <!-- 上传 -->
      <template v-if="item.type === 'Upload'">
        <Upload ref="upload" :imgUrl="formData[item.prop]" :value.sync="formData[item.prop]" />
      </template>  
      <!-- 插槽 -->
      <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>    
    </el-form-item>
    <el-form-item>
      <el-button 
        v-for="item in formHandler" 
        :key="item.key" 
        :type="item.type" 
        @click="item.handler && item.handler()"
      >
        {{ item.label }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 组件
import CityArea from "@c/common/cityArea";
import Wangeditor from "@c/common/wangeditor";
import Upload from "@c/common/upload";
export default {
  name:"VueForm",
  props:{
    labelWidth:{
      type:String,
      default:"120px"
    },
    formData:{
      type:Object,
      default:() => {}
    },
    formItem:{
      type:Array,
      default:() => []
    },
    formHandler:{
      type:Array,
      default:() => []
    }
  },
  components: { CityArea,Wangeditor,Upload },
  data(){
    return{     
      type_msg: {
        "Input":"请输入",
        "InputNumber":"请输入",
        "Radio":"请选择",
        "Checkbox":"请选择",
        "Select":"请选择",
        "Upload":"请上传"
      },
      // 清除富文本
      wangeditorClear: false 
    }
  },
  methods:{
    initFormData(){
      this.formItem.forEach(item => {
        // rules 规则
        if(item.required) { this.rules(item) };
        // 自定义检验规则
        if(item.validator) { item.rules = item.validator; }
      })
    },
    rules(item){
      const requiredRules = [{ required: true, message: item.required_msg || `${this.type_msg[item.type]}${item.label}`, trigger: 'change' }];
      // 其他的 rules 规则 
      if(item.rules && item.rules.length > 0) {
        item.rules = requiredRules.concat(item.rules);
      }else{
        item.rules = requiredRules;
      }
    },
    resetForm(){
      this.$refs.form.resetFields();
      // 清除省市区内容
      if(this.$refs.city && this.$refs.city[0]) this.$refs.city[0].clear();
      // 清除富文本内容
      if(this.$refs.wangeditor) { this.wangeditorClear = !this.wangeditorClear; }
    }
  },
  watch:{
    formItem:{
      handler(newValue,oldValue){ 
        this.initFormData();
      },
      immediate:true
    }
  }
}
</script>