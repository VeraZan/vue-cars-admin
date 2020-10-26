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
      <el-select v-if="item.type === 'Select'" v-model="formData[item.prop]" :placeholder="item.placeholder">
        <el-option
          v-for="selectItem in item.options"
          :key="selectItem.value || selectItem[item.select_value]"
          :label="selectItem.label || selectItem[item.select_label]"
          :value="selectItem.value || selectItem[item.select_value]">
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
      <!-- 插槽 -->
      <slot :name="item.slotName"></slot>
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
  data(){
    return{     
      type_msg: {
        "Input":"请输入",
        "InputNumber":"请输入",
        "Radio":"请选择"
      }
    }
  },
  methods:{
    initFormData(){
      const formData = {};
      this.formItem.forEach(item => {
        // rules 规则
        if(item.required) { this.rules(item) };
        // 自定义检验规则
        if(item.validator) { item.rules = item.validator; }
      })
      this.form = formData;
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

<style>

</style>