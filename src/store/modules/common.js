const state = {
  // table 数据加载标记
  table_loadData_flag: true
}
const mutations = {
  SET_TABLE_DATA_FLAG(state){
    state.table_loadData_flag = !state.table_loadData_flag;  
  }
}
export default {
  namespaced: true,
  state,
  mutations
};