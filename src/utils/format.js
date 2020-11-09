/**
 * 格式化请求数据
 * @param {*} keyData 表单数据项
 * @param {*} requestData 请求返回的数据
 */
export function formatRequestData(keyData,requestData){
  const data={};
  for(let key in keyData){
    if(Object.keys(requestData).includes(key)){
      data[key] = requestData[key];
    }
  }
  return data;
}