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