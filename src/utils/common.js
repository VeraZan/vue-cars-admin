import store from "@/store"
export function address(value){
  let address = value;
  let addressInfo = "";
  if(address) {
    let split = address.split(",");
    addressInfo += split[0];
    // 街道
    if(split[1]) {
      addressInfo += `<br/>${split[1]}`
    }
  }
  return addressInfo;
}
export function parkingType(value){
  const parking_type_json = store.state.config.parking_type_json;
  const data = parking_type_json[value];
  if(data) { return data.label; }
}