<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline">
             <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="区域：">
                  <CityArea :cityAreaValue.sync="form.area" />
                </el-form-item>
                <el-form-item label="类型：">
                  <el-select v-model="form.type" placeholder="请选择" class="width-120">
                     <el-option v-for="item in parking_type" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="禁启用：">
                  <el-select v-model="form.status" placeholder="请选择" class="width-120">
                     <el-option v-for="item in parking_status" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字：">
                  <el-select v-model="search_key" placeholder="请选择" class="width-120">
                    <el-option label="停车场名称" value="parkingName"></el-option>
                    <el-option label="详细区域" value="address"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
                </el-form-item>                         
                <el-form-item>
                  <el-button type="danger" @click="getParkingList">搜索</el-button>
                </el-form-item>
            </el-form>
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
    <!-- 表格数据 -->
    <el-table :data="tableData" v-loading="table_loading" border style="width: 100%">
      <el-table-column type="selection" width="35" fixed="left"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="80">
        <template slot-scope="scope">
          {{ getType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="区域"></el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆" width="100"></el-table-column>
      <el-table-column prop="disabled" label="禁启用" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="lnglat" label="查看位置" width="110">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showMap(scope.row)">查看地图</el-button>
        </template> 
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button size="small" @click="delConfirm(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="padding-top-30">
      <el-col :span="4"><div style="padding: 5px;"></div></el-col>
      <el-col :span="20">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <ShowMapLocation :flagVisible.sync="map_show" :parking_data="parking_data" />
  </div>
</template>
<script> 
import CityArea from "@c/common/cityArea";
import ShowMapLocation from "@c/dialog/showMapLocation";
import { ParkingList,ParkingDelete } from "@/api/parking";
export default {
  name: "Parking",
  components:{ CityArea,ShowMapLocation },
  data() {
    return {
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
      // 请求API的页码
      pageSize: 10,
      pageNumber: 1,
      search_key:"",
      keyword:"",
      map_show:false,
      table_loading: false,
      parking_data:{},
      parking_status: this.$store.state.config.parking_status,
      parking_type: this.$store.state.config.parking_type,
      form: {
        status: "",
        area: "",
        type: "",
      },
      options: [],
      tableData: []
    };
  },
  methods:{
    getType(value){
      const data = this.parking_type.filter(item => item.value == value);
      if(data && data.length > 0){
        return data[0].label;
      }else{
        return "";
      }
    },
    //获取停车场表格数据
    getParkingList(){
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      //过滤筛选
      const filterData = JSON.parse(JSON.stringify(this.form));
      for(let key in filterData){
        if(filterData[key]){
          requestData[key] = filterData[key];
        }
      }
      if(this.search_key && this.keyword) { requestData[this.search_key] = this.keyword }
      this.table_loading = true;
      ParkingList(requestData).then(response => {
        const data = response.data;
        // 判断数据是否存在
        if(data) { this.tableData = data.data }
        // 页码
        if(data.total) { this.total = data.total; }
        this.table_loading = false;
      }).catch(error => {
        this.table_loading = false;
      })
    },
    //改变显示条数
    handleSizeChange(val){
      this.pageSize = val;
      this.getParkingList();
    },
    //改变页码
    handleCurrentChange(val){
      this.pageNumber = val;
      this.getParkingList();
    },
    //查看地图
    showMap(data){
      this.map_show = true;
      this.parking_data = data;
    },
    // 编辑
    edit(id){
      this.$router.push({
        name:"ParkingAdd",
        query:{
          id
        }
      })
    },
    //删除
    delConfirm(id){
      this.$confirm('确定删除此信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ParkingDelete({id}).then(response => {
          this.$message.success(response.message);
          this.getParkingList();
        })
      }).catch(() => {});
    }
  },
  beforeMount(){
    this.getParkingList();
  },
  mounted() {
    
  }
};
</script>
<style lass="scss" scoped>
</style>