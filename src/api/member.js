import service from "../utils/request";

/** 黑名单 */
export function MemberBlacklist(data = {}) {
  return service.request({
    method: "post",
    url: "/member/blacklist/",
    data
  })
}

/** 详情 */
export function MemberDetailed(data = {}) {
  return service.request({
    method: "post",
    url: "/member/detailed/",
    data
  })
}

/** 编辑 */
export function MemberEdit(data = {}) {
  return service.request({
    method: "post",
    url: "/member/edit/",
    data
  })
}

/** 修改认证状态（实名认证、驾驶证） */
export function MemberUpdateReal(data = {}) {
  return service.request({
    method: "post",
    url: "/member/updateRealName/",
    data
  })
}

/** 获取认证图片 */
export function MemberPhoto(data = {}) {
  return service.request({
    method: "post",
    url: "/member/photo/",
    data
  })
}