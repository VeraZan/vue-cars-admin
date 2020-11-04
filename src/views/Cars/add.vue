<template>
  <div class="parking-add">
    <VueForm ref="vueForm" :formItem="form_item" :formData="form_data" :formHandler="form_handler" labelWidth="120px">
       <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6" class="maintainDate_box">
             <el-date-picker v-model="form_data.maintainDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
          </el-col>
          <!-- <el-col :span="6">下次保养日期：2020-12-12</el-col> -->
        </el-row>
      </template>
      <template v-slot:energy>
        <el-radio-group v-model="form_data.energyType" @change="changeEnergyType">
          <el-radio v-for="item in energyType" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 1">
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div class="progress-bar-wrap" v-if="form_data.energyType == 3 || form_data.energyType == 2">
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="10">
              <el-slider v-model="form_data.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:carsAttr>
        <CarsAttr 
          ref="carsAttr" 
          :initValue="form_data.carsAttr" 
          :value.sync="form_data.carsAttr" 
          :oil="form_data.oil" 
          :countKm.sync="form_data.countKm" 
        />
      </template>
      <template v-slot:leaseList>
        <el-row :gutter="10" style="overflow: hidden;">
          <el-col :span="6" v-for="item in lease_list" :key="item.carsLeaseTypeId">
            <div>{{ item.carsLeaseTypeName }}</div>
            <el-input-number v-model="item.price" :min="0" controls-position="right" style="width:100%;"></el-input-number>
          </el-col>
        </el-row>
      </template>
    </VueForm>
  </div>
</template>
<script>

// 组件
import VueForm from "@c/form";
import CarsAttr from "./component/carsAttr";
// API
import { GetCarsBrand, GetParking } from "@/api/common";
import { CarsInfoDetailed, CarsInfoEdit,CarsInfoAdd } from "@/api/cars";
import { LeaseList } from "@/api/lease";
export default {
  name: "CarsAdd",
  components:{ VueForm,CarsAttr },
  data() {
    return {
      id: this.$route.query.id,
      cars_attr: [],
      lease_list:[],
      form_item:[
        {
          type: "Select", 
          label: "车辆品牌", 
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          select_value: "id",   // 自有的私有属性
          select_label: "nameCh",
          options: [],
          required: true
        },
        { 
          type: "Select", 
          label: "停车场", 
          placeholder: "请选择停车场",
          select_value: "id",   // 自有的私有属性
          select_label: "parkingName",
          prop: "parkingId",
          options: [],
          required: true
        },
        { 
          type: "Input", 
          label: "车辆型号", 
          placeholder: "请输入车辆型号",
          prop: "carsMode",
          required: true
        },
        { 
          type: "Input", 
          label: "车牌号", 
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          required: true
        },
        { 
          type: "Input", 
          label: "车架号", 
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          required: true
        },
        { 
          type: "Upload", 
          label: "缩略图", 
          prop: "carsImg",
          required: true
        },
        { 
          type: "Input", 
          label: "发动机号", 
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          required: true
        },
        { 
          type: "Radio", 
          label: "年检", 
          placeholder: "请选择年检",
          prop: "yearCheck",
          options: this.$store.state.config.year_check
        },
        { 
          type: "Slot", 
          slotName: "maintain", 
          prop:"maintainDate", 
          label: "保养日期"
        },
        { 
          type: "Radio", 
          label: "档位", 
          placeholder: "请选择档位",
          prop: "gear",
          options: this.$store.state.config.gear
        },
        { 
          type: "Slot", 
          slotName: "energy", 
          prop:"energyType", 
          label: "能源类型"
        },
        { 
          type: "Slot", 
          slotName: "carsAttr", 
          prop:"carsAttr", 
          label: "车辆属性"
        },
        { 
          type: "Input", 
          label: "可行驶公里数", 
          placeholder: "将根据配置的油量，实测油耗和油箱容积计算得出",
          prop: "countKm",
          append:"km",
          readonly:true
        },
        { 
          type: "Radio", 
          label: "禁启用", 
          prop: "status",
          options:this.$store.state.config.radio_disabled
        },
        { 
          type: "Wangeditor", 
          // slotName: "content", 
          prop:"content", 
          label: "车辆描述"
        },
        { 
          type: "Slot", 
          slotName: "leaseList", 
          prop:"leasePrice", 
          label: "租赁价格"
        }
      ],
      form_handler: [
        { label: "确定", key: "submit", type: "danger", handler: () => this.formValidate() },
        { label: "重置", key: "reset", handler: () => this.$refs.vueForm.resetForm() }
      ],
      form_data: {
        parkingId: "",
        carsBrandId:"",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        carsImg: "",
        engineNumber: "",
        yearCheck: true,
        gear: 1,
        energyType: 2,
        electric: 0,
        oil: 0,
        carsAttr: "",
        content: "",
        maintainDate: "",
        status: true,
        countKm:""
      },
      energyType:this.$store.state.config.energy_type
    };
  },
  beforeMount(){
    this.getCarsBrandList();
    this.getParkingList();
    this.getDetailed();
    this.getLeaseList();
  },
  mounted() {
  },
  methods: {
    formValidate() {
      this.formatCarsAttr();
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.edit() : this.add();
        }
      });
    },
    edit(){
      CarsInfoEdit({...this.form_data,leasePrice:this.lease_list,id: this.id}).then(response => {
        this.$message.success(response.message)
      })
    },
    add(){
      CarsInfoAdd({...this.form_data,leasePrice:this.lease_list}).then(response => {
        this.$message.success(response.message);
        this.$refs.vueForm.resetForm();
        this.cars_attr = [];
        this.form_data.content = "";
      })
    },
     /** 获取详情 */
    getDetailed(){
      if(!this.id) { return false; }
      CarsInfoDetailed({id: this.id}).then(response => {
        const data = response.data;
        if(!data) { return false };
        this.lease_list = data.leasePrice;
        for(let key in data) {
          if(Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key];
          }
        }
      })
    },
    // 获取车辆品牌
    getCarsBrandList(){
      GetCarsBrand().then(response => {
        const data = response.data.data;
        if(data) {
          const carsBrand = this.form_item.filter(item => item.prop == "carsBrandId");
          if(carsBrand.length > 0) {
            carsBrand[0].options = data;
          }
        }
      })
    },
    // 获取停车场
    getParkingList(){
      GetParking().then(response => {
        const data = response.data.data;
        if(data) {
          const parking = this.form_item.filter(item => item.prop == "parkingId");
          if(parking.length > 0) {
            parking[0].options = data;
          }
        }
      })
    },
    //获取租赁类型
    getLeaseList(){
      if(this.id) return false;
      LeaseList().then(response => {
        const data = response.data.data;
        if(data) this.lease_list = data;
      })
    },
    /** 车辆属性格式化 */
    formatCarsAttr(){
      this.$refs.carsAttr.callbackValue();
    },
    changeEnergyType(value){
      this.form_data.electric = 0;
      this.form_data.oil = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.maintainDate_box{
  padding: 0 !important;
  .el-date-editor{
    width:100%;
  }
}
.cars-attr-list { 
  margin-top: 15px;
  overflow:hidden;
}
</style>

