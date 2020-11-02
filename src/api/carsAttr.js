import service from "../utils/request";

/** 车辆公用属性 */
export function GetCarsAttrTypeBasis(data = {}){
  return service.request({
    method: "post",
    url: "/carsAttr/type/",
    data
  })
}

/** 自定义属性列表 */
export function GetCarsAttrList(data = {}){
  return service.request({
    method: "post",
    url: "/carsAttr/list/",
    data
  })
}

/** 自定义属性添加 */
export function CarsAttrAdd(data = {}){
  return service.request({
    method: "post",
    url: "/carsAttr/add/",
    data
  })
}