const state = {
  // table 数据加载标记
  table_loadData_flag: true,
  //upload token
  upload_token:""
}
const mutations = {
  SET_TABLE_DATA_FLAG(state){
    state.table_loadData_flag = !state.table_loadData_flag;  
  },
  SET_UPLOAD_TOKEN(state,value){
    state.upload_token = value;
  }
}
export default {
  namespaced: true,
  state,
  mutations
};