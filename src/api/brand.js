import service from "../utils/request";
/** 新增品牌 */
export function BrandAdd(data = {}) {
  return service.request({
    method: "post",
    url: "/brand/add/",
    data
  })
}
/** 修改品牌 */
export function BrandEdit(data = {}) {
  return service.request({
    method: "post",
    url: "/brand/edit/",
    data
  })
}
/** 删除品牌 */
export function BrandDelete(data = {}) {
  return service.request({
    method: "post",
    url: "/brand/delete/",
    data
  })
}
/** 品牌列表 */
export function BrandList(data = {}){
  return service.request({
    method: "post",
    url: "/brand/list/",
    data
  })
}
/** 品牌详情 */
export function BrandDetailed(data = {}){
  return service.request({
    method: "post",
    url: "/brand/detailed/",
    data
  })
}
/** 品牌状态 */
export function BrandStatus(data = {}){
  return service.request({
    method: "post",
    url: "/brand/status/",
    data
  })
}
/** 品牌标志 */
export function BrandLogo(data = {}){
  return service.request({
    method: "post",
    url: "/brand/logo/",
    data
  })
}