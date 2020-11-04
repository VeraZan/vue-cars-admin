import service from "../utils/request";

/** 添加 */
export function CarsAdd(data = {}){
  return service.request({
    method: "post",
    url: "/cars/add/",
    data
  })
}

/** 添加（含租赁类型） */
export function CarsInfoAdd(data = {}){
  return service.request({
    method: "post",
    url: "/cars/carsInfoAdd/",
    data
  })
}

/** 禁启用状态 */
export function CarsStatus(data = {}){
  return service.request({
    method: "post",
    url: "/cars/status/",
    data
  })
}

/** 删除 */
export function CarsDelete(data = {}){
  return service.request({
    method: "post",
    url: "/cars/delete/",
    data
  })
}

/** 详情 */
export function CarsDetailed(data = {}){
  return service.request({
    method: "post",
    url: "/cars/detailed/",
    data
  })
}

/** 详情（含租赁类型） */
export function CarsInfoDetailed(data = {}){
  return service.request({
    method: "post",
    url: "/cars/carsDetailed/",
    data
  })
}

/** 编辑 */
export function CarsEdit(data = {}){
  return service.request({
    method: "post",
    url: "/cars/edit/",
    data
  })
}

/** 编辑（含租赁类型） */
export function CarsInfoEdit(data = {}){
  return service.request({
    method: "post",
    url: "/cars/carsInfoEdit/",
    data
  })
}