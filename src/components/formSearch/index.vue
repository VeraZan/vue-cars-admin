<template>
  <div class="filter-form">
    <el-row>
      <el-col :span="formConfig.formCol">
        <el-form :inline="true" class="demo-form-inline" :model="form_data" ref="form">
          <el-form-item v-for="item in formItem" :label="item.label" :prop="item.prop" :key="item.prop" :rules="item.rules">
            <!-- 输入框 -->
            <el-input 
              v-if="item.type === 'Input'" 
              v-model.trim="form_data[item.prop]" 
              :placeholder="item.placeholder" 
              :style="{ width:item.width }"       
              :readonly="item.readonly" 
              :disabled="item.disabled"
            ></el-input>
            <!-- 选择器 -->
            <el-select v-if="item.type === 'Select'" v-model="form_data[item.prop]" clearable filterable :placeholder="item.placeholder" :style="{ width:item.width }" >
              <el-option
                v-for="selectItem in item.options"
                :key="selectItem.value !== undefined ?  selectItem.value : selectItem[item.select_value]"
                :label="selectItem.label || selectItem[item.select_label]"
                :value="selectItem.value !== undefined ?  selectItem.value : selectItem[item.select_value]">
              </el-option>
            </el-select>
            <!-- 单选框 -->
            <el-radio-group v-if="item.type === 'Radio'" v-model="form_data[item.prop]" >
              <el-radio 
                v-for="radio in item.options" 
                :label="radio.value" 
                :key="radio.value"
              >
                {{ radio.label }}
              </el-radio>
            </el-radio-group>
            <!-- 计数器 -->
            <el-input-number v-if="item.type === 'InputNumber'" v-model.trim="form_data[item.prop]" :min="item.min" :max="item.max"></el-input-number>    
            <!-- 省市区 -->
            <template v-if="item.type === 'City'">
              <CityArea ref="city" :cityAreaValue.sync="form_data[item.prop]" />
            </template>
            <!-- 关键字 -->
            <template v-if="item.type === 'KeyWord'">
              <KeyWord ref="keyword" :options="item.options" :value.sync="keyword" />
            </template>
            <!-- 插槽 -->
            <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>    
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="search">搜索</el-button>
            <el-button @click="reset" v-if="formConfig.resetButton">重置</el-button>             
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="formConfig.handlerCol">
        <div class="pull-right">
          <template v-for="item in formHandler">
            <el-button v-if="item.element === 'link'" :key="item.key" :type="item.type">
              <router-link :to="item.router" >
                <span class="color-white">{{ item.label }}</span>
              </router-link>
            </el-button>
            <el-button v-if="item.element === 'button'" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
              {{ item.label }}
            </el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CityArea from "@c/common/cityArea";
import KeyWord from "@c/common/keyWord";
export default {
  name:"FormSearch",
  props:{
    formItem:{
      type:Array,
      default:() => []
    },
    formHandler:{
      type:Array,
      default:() => []
    },
    formConfig:{
      type: Object,
      default: () => {}
    }
  },
  components:{ CityArea,KeyWord },
  data(){
    return{     
      keyword: {},
      form_data:{

      }
    }
  },
  methods:{
    search(){
      const searchData = {};
      // 过滤空数据
      for(let key in this.form_data) {
        if(this.form_data[key] !== undefined && this.form_data[key] !== null && this.form_data[key] !== "") {
          searchData[key] = this.form_data[key];
        }
      }
      // 关键字
      if(this.$refs.keyword && this.keyword.key && this.keyword.value) {
        searchData[this.keyword.key]  = this.keyword.value
      }
      this.$emit("callback", {
        function: "search",
        data: searchData
      })
    },
    initFormData(){
      const formData = {};
      this.formItem.forEach(item => {              
        //下拉选框的数据
        if(item.type === "Select") { this.selectOption(item) }
      })
    },   
    // 字段初始化
    initFormField(){
      const field = {};
      this.formItem.forEach(item => {
        if(item.prop) {
          field[item.prop] = "";
        }
      })
      this.form_data = field;
    },
    selectOption(data){
      const options = this.$store.state.config[data.options];
      if(options){
        data.options = options;
      }
    },
    reset(){
      this.$refs.form.resetFields();     
      if(this.$refs.city && this.$refs.city[0]) this.$refs.city[0].clear();
      if(this.$refs.keyword && this.$refs.keyword[0]) this.$refs.keyword[0].clear();
    }
  },
  watch:{
    formItem:{
      handler(newValue,oldValue){
        this.initFormData();
        this.initFormField();
      },
      immediate:true
    }
  }
}
</script>