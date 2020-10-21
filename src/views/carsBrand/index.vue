<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="车辆品牌">
              <el-select v-model="form.region" placeholder="选择品牌">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌型号">
              <el-input v-model="form.user" placeholder="审批人"></el-input>
            </el-form-item>           
            <el-form-item>
              <el-button type="danger">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button type="danger" class="pull-right" @click="dialogFormVisible = true">新增车辆品牌</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" fixed="left" width="35"></el-table-column>
      <el-table-column prop="name" label="LOGO"></el-table-column>   
      <el-table-column prop="name" label="车辆品牌"></el-table-column>   
      <el-table-column prop="name" label="品牌型号"></el-table-column>   
      <el-table-column label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="mini">编辑</el-button>
          <el-button size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddCarsBrand :flagVisible.sync="dialogFormVisible" />
  </div>
</template>

<script>
import AddCarsBrand from "@c/dialog/addCarsBrand";
export default {
  name:"CarsBrandIndex",
  components:{ AddCarsBrand },
  data(){
    return{
      dialogFormVisible:false,
      form: {
        user: '',
        region: ''
      },
      tableData: [{        
        name: '王小虎',
        status:0
      }],
    }
  }
}
</script>

<style lang="scss" scoped>

</style>