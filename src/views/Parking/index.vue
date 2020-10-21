<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
             <el-cascader v-model="form.value" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="停车场" class="width-120">
                <el-option v-for="item in parking_type" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select v-model="form.status" placeholder="请选择" class="width-120">
                <el-option v-for="item in parking_status" :label="item.label" :value="item.value" :key="item.value" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="search_key" placeholder="请选择" class="width-120">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="keyword" placeholder="请输入关键字按Enter搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" fixed="left" width="35"></el-table-column>
      <el-table-column prop="name" label="停车场名称"></el-table-column>   
      <el-table-column prop="name" label="类型"></el-table-column>   
      <el-table-column prop="name" label="区域"></el-table-column>   
      <el-table-column prop="name" label="可停放车辆"></el-table-column>   
      <el-table-column label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="查看位置"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini">编辑</el-button>
          <el-button size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ParkingIndex",
  data(){
    return{
      // 筛选
      form: {
        area: "",
        type: "",
        status: "",
        value:[]
      },
      tableData: [{        
        name: '王小虎',
        status:0
      }],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }]
      }],
      search_key: "",
      keyword: "",
      parking_type:[],
      parking_status:[],
    }
  }
};
</script>

<style>
</style>