<template>
  <div>
    <FormSearch 
      v-if="table_config.search_form" 
      :formItem="table_config.form_item" 
      :formHandler="table_config.form_handler" 
      :formConfig="table_config.form_config"
      @callback="callbackComponent"
    >
    </FormSearch>
    <slot name="otherContent"></slot>
    <el-table v-loading="loading_table" element-loading-text="加载中" :data="table_data" border style="width: 100%;">
      <el-table-column v-if="table_config.checkbox" type="selection" width="35" fixed="left"></el-table-column>
      <template v-for="item in this.table_config.thead">
        <!--回调-->
        <el-table-column v-if="item.type === 'function'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
          <template slot-scope="scope">
            <span v-html="item.callback && item.callback(scope.row, item.prop)"></span>
          </template>
        </el-table-column>
        <!--插槽-->
        <el-table-column v-else-if="item.type === 'slot'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!--图片-->
        <el-table-column v-else-if="item.type === 'image'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
          <template slot-scope="scope">
            <img :src="scope.row[item.prop]" :width="item.imgWidth || 50">
          </template>
        </el-table-column>
         <!--操作 -->
        <el-table-column v-else-if="item.type === 'operation'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
          <template slot-scope="scope">
            <!--插槽（操作）-->
            <slot v-if="item.slotName" :name="item.slotName" :data="scope.row"></slot>
            <!--编辑-->
            <template v-if="item.default && item.default.editButton">
              <el-button  v-if="item.default.editButtonEvent" type="danger" size="small" @click="edit(scope.row[item.default.id || 'id'], item.default.editButtonLink)">编辑</el-button>
              <router-link v-else :to="{name: item.default.editButtonLink, query: { id: scope.row[item.default.id || 'id'] }}" class="mr-10">
                <el-button type="danger" size="small">编辑</el-button>
              </router-link>
            </template>
            <!--删除-->
            <el-button size="small" v-if="item.default && item.default.deleteButton" :loading="scope.row.id == rowId" @click="delConfirm(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <!--纯文本渲染-->
        <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed"></el-table-column>
      </template>     
    </el-table>
    <el-row class="padding-top-30">
      <el-col :span="4"><div style="padding: 5px;"></div></el-col>
      <el-col :span="20">
        <el-pagination
          v-if="table_config.pagination" 
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
  </div>  
</template>

<script>
//组件
import FormSearch from "@c/formSearch";
// API
import { GetTableData, Delete } from "@/api/common";
export default {
  name:"TableData",
  components:{ FormSearch },
  data(){
    return{
      // 加载提示
      loading_table: false,
      // tableData
      table_data: [],
      table_config: {
        //初始化是否请求接口
        isRequest:true,
        thead: [],
        checkbox: true,
        url: "",
        pagination:true,
        search_form:true,
        data: {},
        form_item:[],
        form_handler:[],
        form_config:{}
      },
      // 页码
      total: 0,
      // 当前页码
      currentPage: 1,
      rowId:"",     
      form_data:{

      }
    }
  },
  props:{
    config:{
      type:Object,
      default:() => {}
    }
  },
  methods:{
    callbackComponent(params){
      this[params.function](params.data);
    },
    search(data){
      const searchData = data;
      searchData.pageNumber = 1;
      searchData.pageSize = 10;
      this.requestData(searchData);
    },
    /** table config */
    initConfig(){
      for(let key in this.config) {
        if(Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key];
        }
      }
      // 配置完成后开始读取接口数据
      this.table_config.isRequest && this.loadData();
    },
    loadData(){
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data
      }
      this.loading_table = true;
      GetTableData(requestData).then(response => {
        const data = response.data;
        // 判断数据是否存在
        if(data) { this.table_data = data.data }
        if(data.total) { this.total = data.total; }
        this.loading_table = false;
      }).catch(error => {
        this.loading_table = false;
      })
    },
    requestData(params = ""){
      if(params) {
        // 处理业务逻辑
        this.table_config.data = params;
      }
      this.loadData();
    },
    /** 页码 */
    handleSizeChange(val){
      this.table_config.data.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val){
      this.table_config.data.pageNumber = val;
      this.loadData();
    },
     /**删除 */
    delConfirm(id){
      this.$confirm('确定删除此信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rowId = id;
        let requestData = {
          url: this.table_config.url + "Delete",
          data: { id },
        }
        Delete(requestData).then(response => {
          this.$message.success(response.message);
          this.rowId = "";
          this.loadData();
        }).cacth(error => {
          this.rowId = "";
        })
      }).catch(() => {});
    },
    /** 编辑 */
    edit(id, routerNmae){
      this.$router.push({
        name: routerNmae,
        query: {
          id
        }
      })
    }
  },
  watch: {
    config: {
      handler(newValue,oldValue) {
        this.initConfig();
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>